"use strict";

const assert = require("power-assert");
const sinon = require("sinon");

const index = require("../src/index");

const STORAGE_FUNCTIONS = {
    SET : "dummy-set",
    GET : "dummy-get",
    UNSET : "dummy-unset"
};

describe("lambda handler",()=>{
   it("returns userdata identified by 'userId' argment if exists",()=>{
       const dummyUserId = "dummy-user-id";
       const dummyEvent = {userId:dummyUserId};
       const expectedResult = {id:dummyUserId};
       
       const dummyLambda = {};
       dummyLambda.invoke = sinon.stub();
       dummyLambda.invoke.onFirstCall().callsArgWith(1,null,{Payload:JSON.stringify(expectedResult)});
       
       const dummyMixins = {
         resolveMixin:()=>{}  
       };
       
       const handler = index.factory(dummyLambda,STORAGE_FUNCTIONS,dummyMixins);
       
       const callback = sinon.spy();
       
       handler(dummyEvent,{},callback);
       
       assert(dummyLambda.invoke.called);
       assert.equal(dummyLambda.invoke.getCall(0).args[0]["FunctionName"],STORAGE_FUNCTIONS.GET);
       assert.equal(JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"])["key"],"user-" + dummyUserId);
       
       assert(callback.called);
       assert.equal(callback.getCall(0).args[0],null);
       assert.deepEqual(callback.getCall(0).args[1],expectedResult);
   });
   
   it("creates new userdata if the one identified by 'userId' doesn't exist, and returns the new one",()=>{
       const dummyUserId = "dummy-user-id";
       const dummyEvent = {userId:dummyUserId};
       const expectedResult = {id:dummyUserId};
       
       const dummyLambda = {};
       dummyLambda.invoke = sinon.stub();
       dummyLambda.invoke.onFirstCall().callsArgWith(1,null,{Payload:JSON.stringify(null)});
       dummyLambda.invoke.onSecondCall().callsArgWith(1,null,null);
       
       const dummyMixins = {
         resolveMixin:()=>{}  
       };
       
       const handler = index.factory(dummyLambda,STORAGE_FUNCTIONS,dummyMixins);
       
       const callback = sinon.spy();
       
       handler(dummyEvent,{},callback);
       
       assert(dummyLambda.invoke.called);
       assert.equal(dummyLambda.invoke.getCall(0).args[0]["FunctionName"],STORAGE_FUNCTIONS.GET);
       assert.equal(JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"])["key"],"user-" + dummyUserId);
       assert.equal(dummyLambda.invoke.getCall(1).args[0]["FunctionName"],STORAGE_FUNCTIONS.SET);
       assert.equal(JSON.parse(dummyLambda.invoke.getCall(1).args[0]["Payload"])["key"],"user-" + dummyUserId);
       assert.deepEqual(JSON.parse(dummyLambda.invoke.getCall(1).args[0]["Payload"])["value"],expectedResult);
       
       assert(callback.called);
       assert.equal(callback.getCall(0).args[0],null);
       assert.deepEqual(callback.getCall(0).args[1],expectedResult);
   });
   
   it("invokes specified mixin fanction with userdate if exists",()=>{
      const dummyUserId = "dummy-user-id";
      const dummyEvent = {
          userId:dummyUserId,
          mixin:{
              functionName:"foo",
              payload:"var"
          }
      };
      
      const dummyExistUser = {
          id:dummyUserId
      };
      
      const dummyLambda = {};
      dummyLambda.invoke = sinon.stub();
      dummyLambda.invoke.onFirstCall().callsArgWith(1,null,{Payload:JSON.stringify(dummyExistUser)});
      
      const dummyMixins = {
         resolveMixin:sinon.stub()
      };
      
      const dummyResolve = sinon.spy(); 
      dummyMixins.resolveMixin.returns(dummyResolve);
      
      const handler = index.factory(dummyLambda,STORAGE_FUNCTIONS,dummyMixins);
       
      const callback = sinon.spy();
       
      handler(dummyEvent,{},callback);
      
      assert(dummyLambda.invoke.called);
      assert.equal(dummyLambda.invoke.getCall(0).args[0]["FunctionName"],STORAGE_FUNCTIONS.GET);
      assert.equal(JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"])["key"],"user-" + dummyUserId);
      
      assert(dummyMixins.resolveMixin.called);
      
      assert(dummyResolve.called);
      assert.equal(dummyResolve.getCall(0).args[0],dummyEvent.mixin.functionName);
      assert.equal(dummyResolve.getCall(0).args[1],dummyEvent.mixin.payload);
      assert.deepEqual(dummyResolve.getCall(0).args[2],dummyExistUser);
   });
   
   it("creates new userdata and invokes specified mixin fanction with it if userdata doesn't exist",()=>{
      const dummyUserId = "dummy-user-id";
      const dummyEvent = {
          userId:dummyUserId,
          mixin:{
              functionName:"foo",
              payload:"var"
          }
      };
      
      const expectedNewExistUser = {
          id:dummyUserId
      };
      
      const dummyLambda = {};
      dummyLambda.invoke = sinon.stub();
      dummyLambda.invoke.onFirstCall().callsArgWith(1,null,{Payload:JSON.stringify(null)});
      dummyLambda.invoke.onSecondCall().callsArgWith(1,null,null);
      
      const dummyMixins = {
         resolveMixin:sinon.stub()
      };
      
      const dummyResolve = sinon.spy(); 
      dummyMixins.resolveMixin.returns(dummyResolve);
      
      const handler = index.factory(dummyLambda,STORAGE_FUNCTIONS,dummyMixins);
       
      const callback = sinon.spy();
       
      handler(dummyEvent,{},callback);
      
      assert(dummyLambda.invoke.called);
      assert.equal(dummyLambda.invoke.getCall(0).args[0]["FunctionName"],STORAGE_FUNCTIONS.GET);
      assert.equal(JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"])["key"],"user-" + dummyUserId);
      
      assert(dummyMixins.resolveMixin.called);
      
      assert(dummyResolve.called);
      assert.equal(dummyResolve.getCall(0).args[0],dummyEvent.mixin.functionName);
      assert.equal(dummyResolve.getCall(0).args[1],dummyEvent.mixin.payload);
      assert.deepEqual(dummyResolve.getCall(0).args[2],expectedNewExistUser);
   });
   
   it("throws error if 'userId' argument doesn't exist",()=>{
       const dummyEvent = {};
       
       const dummyLambda = {};
       
       const dummyMixins = {};
       const handler = index.factory(dummyLambda,STORAGE_FUNCTIONS,dummyMixins);
       
       const callback = sinon.spy();
       
       handler(dummyEvent,{},callback);
       
       assert(callback.called);
       assert(callback.getCall(0).args[0]);
   });
});