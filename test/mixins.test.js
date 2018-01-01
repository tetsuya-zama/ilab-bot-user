"use strict";

const assert = require("power-assert");
const sinon = require("sinon");

const mixins = require("../src/mixins");

const STORAGE_FUNCTIONS = {
    SET : "dummy-set",
    GET : "dummy-get",
    UNSET : "dummy-unset"
};

describe("setUserAttr mixin",()=>{
   it("creates first attribute of userdata",()=>{
     const dummyUserId = "dummy-user-id";
     const dummyUserData = {id:dummyUserId};
     
     const dummyPayload = {
         key:"testKey",
         value:"testValue"
     };
     
     const expectedUserData = Object.assign({},dummyUserData,{attributes:{testKey:"testValue"}});
     
     const dummyLambda = {};
     dummyLambda.invoke = sinon.stub();
     dummyLambda.invoke.onFirstCall().callsArgWith(1,null,null);
     
     const callback = sinon.spy();
     
     const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
     
     resolver("setUserAttr",dummyPayload,dummyUserData);
     
     assert(dummyLambda.invoke.called);
     assert.equal(dummyLambda.invoke.getCall(0).args[0]["FunctionName"],STORAGE_FUNCTIONS.SET);
     assert.equal(JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"])["key"],"user-" + dummyUserId);
     assert.deepEqual(JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"])["value"],expectedUserData);
     
     assert(callback.called);
     assert.equal(callback.getCall(0).args.length,0);
   });
   
   it("create secound and later attributes of userdata",()=>{
    const dummyUserId = "dummy-user-id";
    const dummyUserData = {
         id:dummyUserId,
         attributes:{
             testKey:"testValue"
         }
     };
     
     const dummyPayload = {
         key:"testKey2",
         value:"testValue2"
     };
     
     const expectedUserData = {
        id:dummyUserId,
        attributes:{
            testKey:"testValue",
            testKey2:"testValue2"
        }
     };
         
     const dummyLambda = {};
     dummyLambda.invoke = sinon.stub();
     dummyLambda.invoke.onFirstCall().callsArgWith(1,null,null);
     
     const callback = sinon.spy();
     
     const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
     
     resolver("setUserAttr",dummyPayload,dummyUserData);
     
     assert(dummyLambda.invoke.called);
     assert.equal(dummyLambda.invoke.getCall(0).args[0]["FunctionName"],STORAGE_FUNCTIONS.SET);
     assert.equal(JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"])["key"],"user-" + dummyUserId);
     assert.deepEqual(JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"])["value"],expectedUserData);
     
     assert(callback.called);
     assert.equal(callback.getCall(0).args.length,0);  
   });
   
   it("updates exsiting attribute of userdata",()=>{
     const dummyUserId = "dummy-user-id";
     const dummyUserData = {
         id:dummyUserId,
         attributes:{
             testKey:"testValue"
         }
      };
     
      const dummyPayload = {
         key:"testKey",
         value:"testValue2"
      };
     
      const expectedUserData = {
        id:dummyUserId,
        attributes:{
            testKey:"testValue2"
        }
      };

     const dummyLambda = {};
     dummyLambda.invoke = sinon.stub();
     dummyLambda.invoke.onFirstCall().callsArgWith(1,null,null);
     
     const callback = sinon.spy();
     
     const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
     
     resolver("setUserAttr",dummyPayload,dummyUserData);
     
     assert(dummyLambda.invoke.called);
     assert.equal(dummyLambda.invoke.getCall(0).args[0]["FunctionName"],STORAGE_FUNCTIONS.SET);
     assert.equal(JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"])["key"],"user-" + dummyUserId);
     assert.deepEqual(JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"])["value"],expectedUserData);
     
     assert(callback.called);
     assert.equal(callback.getCall(0).args.length,0); 
   });
   
   it("throws error when lambda.invoke throws some error",()=>{
     const dummyUserId = "dummy-user-id";
     const dummyUserData = {id:dummyUserId};
     
     const dummyPayload = {
         key:"testKey",
         value:"testValue"
     };
     
     const expectedUserData = Object.assign({},dummyUserData,{attributes:{testKey:"testValue"}});
     
     const dummyLambda = {};
     dummyLambda.invoke = sinon.stub();
     dummyLambda.invoke.onFirstCall().callsArgWith(1,"some error",null);
     
     const callback = sinon.spy();
     
     const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
     
     resolver("setUserAttr",dummyPayload,dummyUserData);
     
     assert(dummyLambda.invoke.called);
     assert.equal(dummyLambda.invoke.getCall(0).args[0]["FunctionName"],STORAGE_FUNCTIONS.SET);
     assert.equal(JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"])["key"],"user-" + dummyUserId);
     assert.deepEqual(JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"])["value"],expectedUserData);
     
     assert(callback.called);
     assert.equal(callback.getCall(0).args.length,1);      
   });
});

describe("getUserAttr mixin",()=>{
   it("returns value of user attributes identified by the key",()=>{
      const dummyUserId = "dummy-user-id";
      const dummyUserData = {
          id:dummyUserId,
          attributes:{
              testKey:"testValue"
          }
      };
      
      const dummyPayload = {key:"testKey"};
      
      const dummyLambda = {};
      
      const callback = sinon.spy();
      
      const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
      
      resolver("getUserAttr",dummyPayload,dummyUserData);
      
      assert(callback.called);
      assert.equal(callback.getCall(0).args[1],dummyUserData.attributes[dummyPayload.key]);
   });
   
   it("returns null if user has no attributes",()=>{
      const dummyUserId = "dummy-user-id";
      const dummyUserData = {
          id:dummyUserId,
      };
      
      const dummyPayload = {key:"testKey"};
      
      const dummyLambda = {};
      
      const callback = sinon.spy();
      
      const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
      
      resolver("getUserAttr",dummyPayload,dummyUserData);
      
      assert(callback.called);
      assert.equal(callback.getCall(0).args.length,0);
   });
   
   it("returns null if user has no value which identified by the key",()=>{
      const dummyUserId = "dummy-user-id";
      const dummyUserData = {
          id:dummyUserId,
          attributes:{
              testKey2:"testValue2"
          }
      };
      
      const dummyPayload = {key:"testKey"};
      
      const dummyLambda = {};
      
      const callback = sinon.spy();
      
      const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
      
      resolver("getUserAttr",dummyPayload,dummyUserData);
      
      assert(callback.called);
      assert.equal(callback.getCall(0).args.length,0);
   });
});

describe("connectDialog mixin",()=>{
    it("creates new dialog object if another dialog doesn't exist",()=>{
        const dummyUserId = "dummy-user-id";
        const dummyUserData = {id:dummyUserId};
        
        const dummyPayload = {ownerFunction:"dummy-owner-function-name"};

        
        const dummyLambda = {};
        dummyLambda.invoke = sinon.stub();
        
        dummyLambda.invoke.onFirstCall().callsArgWith(1,null,null);
        
        const callback = sinon.spy();
        
        const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
        
        resolver("connectDialog",dummyPayload,dummyUserData);
        
        assert(dummyLambda.invoke.called);
        assert.equal(dummyLambda.invoke.getCall(0).args[0]["FunctionName"],STORAGE_FUNCTIONS.SET);
        const invokePayload = JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"]);
        assert.equal(invokePayload.key,"user-" + dummyUserId);
        assert(invokePayload.value.dialog);
        assert.equal(invokePayload.value.dialog.ownerFunction,dummyPayload.ownerFunction);
        assert(new Date(invokePayload.value.dialog.expires).getTime() > (new Date()).getTime());
        
        assert(callback.called);
        assert.equal(callback.getCall(0).args.length,0);
    });
    
    it("creates dialog object with initial arguments if 'attributes' payload is passed",()=>{
        const dummyUserId = "dummy-user-id";
        const dummyUserData = {id:dummyUserId};
        
        const dummyPayload = {
            ownerFunction:"dummy-owner-function-name",
            attributes:{
                testKey1:"testValue1",
                testKey2:"testValue2"
            }
        };

        
        const dummyLambda = {};
        dummyLambda.invoke = sinon.stub();
        
        dummyLambda.invoke.onFirstCall().callsArgWith(1,null,null);
        
        const callback = sinon.spy();
        
        const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
        
        resolver("connectDialog",dummyPayload,dummyUserData);
        
        assert(dummyLambda.invoke.called);
        assert.equal(dummyLambda.invoke.getCall(0).args[0]["FunctionName"],STORAGE_FUNCTIONS.SET);
        const invokePayload = JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"]);
        assert.equal(invokePayload.key,"user-" + dummyUserId);
        assert(invokePayload.value.dialog);
        assert.equal(invokePayload.value.dialog.ownerFunction,dummyPayload.ownerFunction);
        assert(new Date(invokePayload.value.dialog.expires).getTime() > (new Date()).getTime());
        assert.deepEqual(invokePayload.value.dialog.attributes,dummyPayload.attributes);
        
        assert(callback.called);
        assert.equal(callback.getCall(0).args.length,0);        
    });
    
    it("creates new dialog even if another dialog exists when current dialog has been exipired",()=>{
        const dummyUserId = "dummy-user-id";
        const currentDialogExpires = new Date();
        currentDialogExpires.setSeconds(currentDialogExpires.getSeconds() - 60);
        const dummyUserData = {
            id:dummyUserId,
            dialog:{
                ownerFunction:"dummy-another-owner-function-name",
                expires:currentDialogExpires.toISOString()
            }
        };
        
        const dummyPayload = {ownerFunction:"dummy-owner-function-name"};

        
        const dummyLambda = {};
        dummyLambda.invoke = sinon.stub();
        
        dummyLambda.invoke.onFirstCall().callsArgWith(1,null,null);
        
        const callback = sinon.spy();
        
        const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
        
        resolver("connectDialog",dummyPayload,dummyUserData);
        
        assert(dummyLambda.invoke.called);
        assert.equal(dummyLambda.invoke.getCall(0).args[0]["FunctionName"],STORAGE_FUNCTIONS.SET);
        const invokePayload = JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"]);
        assert.equal(invokePayload.key,"user-" + dummyUserId);
        assert(invokePayload.value.dialog);
        assert.equal(invokePayload.value.dialog.ownerFunction,dummyPayload.ownerFunction);
        assert(new Date(invokePayload.value.dialog.expires).getTime() > (new Date()).getTime());
        
        assert(callback.called);
        assert.equal(callback.getCall(0).args.length,0);
    });
    
    it("throws error if user has already have dialog and it has not been expired",()=>{
        const dummyUserId = "dummy-user-id";
        const currentDialogExpires = new Date();
        currentDialogExpires.setSeconds(currentDialogExpires.getSeconds() + 60);
        const dummyUserData = {
            id:dummyUserId,
            dialog:{
                ownerFunction:"dummy-another-owner-function-name",
                expires:currentDialogExpires.toISOString()
            }
        };
        
        const dummyPayload = {ownerFunction:"dummy-owner-function-name"};

        
        const dummyLambda = {};

        const callback = sinon.spy();
        
        const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
        
        resolver("connectDialog",dummyPayload,dummyUserData);
        
        assert(callback.called);
        assert.equal(callback.getCall(0).args.length,1);
    });
});

describe("expandDialog mixin",()=>{
    it("expands expiration of dialog",()=>{
       const dummyUserId = "dummy-user-id";
       const currentDialogExpires = new Date();
       currentDialogExpires.setSeconds(currentDialogExpires.getSeconds() - 1);
       const dummyUserData = {
           id:dummyUserId,
           dialog:{
               ownerFunction:"dummy-owner-function-name",
               expires:currentDialogExpires.toISOString()
           }
       };
       
       const dummyPayload = {ownerFunction:"dummy-owner-function-name"};
       
       const dummyLambda = {};
       dummyLambda.invoke = sinon.stub();
       
       dummyLambda.invoke.onFirstCall().callsArgWith(1,null,null);
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("expandDialog",dummyPayload,dummyUserData);
       
       assert(dummyLambda.invoke.called);
       assert.equal(dummyLambda.invoke.getCall(0).args[0]["FunctionName"],STORAGE_FUNCTIONS.SET);
       const invokePayload = JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"]);
       assert.equal(invokePayload.key,"user-" + dummyUserId);
       assert(invokePayload.value.dialog);
       assert.equal(invokePayload.value.dialog.ownerFunction,dummyPayload.ownerFunction);
       assert(new Date(invokePayload.value.dialog.expires).getTime() > (new Date()).getTime());
       
       assert(callback.called);
       assert.equal(callback.getCall(0).args.length,0);
    });
    
    it("throws error if user has no dialog",()=>{
       const dummyUserId = "dummy-user-id";
       const dummyUserData = {
           id:dummyUserId
       };
       
       const dummyPayload = {ownerFunction:"dummy-owner-function-name"};
       
       const dummyLambda = {};
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("expandDialog",dummyPayload,dummyUserData);
       
       assert(callback.called);
       assert.equal(callback.getCall(0).args.length,1);
    });
    
    it("throws error if user has already have another dialog between another owner function",()=>{
       const dummyUserId = "dummy-user-id";
       const currentDialogExpires = new Date();
       const dummyUserData = {
           id:dummyUserId,
           dialog:{
               ownerFunction:"dummy-another-owner-funcation-name",
               expires:currentDialogExpires.toISOString()
           }
       };
       
       const dummyPayload = {ownerFunction:"dummy-owner-function-name"};
       
       const dummyLambda = {};
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("expandDialog",dummyPayload,dummyUserData);
       
       assert(callback.called);
       assert.equal(callback.getCall(0).args.length,1);
    });
});

describe("disconnectDialog mixin",()=>{
   it("deletes dialog object",()=>{
     const dummyUserId = "dummy-user-id";
     const currentDialogExpires = new Date();
     currentDialogExpires.setSeconds(currentDialogExpires.getSeconds() + 10);
     const dummyUserData = {
         id:dummyUserId,
         dialog:{
             ownerFunction:"dummy-owner-function-name",
             expires:currentDialogExpires.toISOString()
         }
     };
     
     const dummyPayload = {ownerFunction:"dummy-owner-function-name"};
     
     const dummyLambda = {};
     dummyLambda.invoke = sinon.stub();
     dummyLambda.invoke.onFirstCall().callsArgWith(1,null,null);
     
     const callback = sinon.spy();
     
     const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
     
     resolver("disconnectDialog",dummyPayload,dummyUserData);
     
     
     assert(dummyLambda.invoke.called);
     assert.equal(dummyLambda.invoke.getCall(0).args[0]["FunctionName"],STORAGE_FUNCTIONS.SET);
     const invokePayload = JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"]);
     assert.equal(invokePayload.key,"user-" + dummyUserId);
     assert(!invokePayload.value.dialog);
     
     assert(callback.called);
     assert.equal(callback.getCall(0).args.length,0);
   }); 
    it("throws error if user has no dialog",()=>{
       const dummyUserId = "dummy-user-id";
       const dummyUserData = {
           id:dummyUserId
       };
       
       const dummyPayload = {ownerFunction:"dummy-owner-function-name"};
       
       const dummyLambda = {};
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("disconnectDialog",dummyPayload,dummyUserData);
       
       assert(callback.called);
       assert.equal(callback.getCall(0).args.length,1);
    });
    
    it("throws error if user has already have another dialog between another owner function",()=>{
       const dummyUserId = "dummy-user-id";
       const currentDialogExpires = new Date();
       const dummyUserData = {
           id:dummyUserId,
           dialog:{
               ownerFunction:"dummy-another-owner-funcation-name",
               expires:currentDialogExpires.toISOString()
           }
       };
       
       const dummyPayload = {ownerFunction:"dummy-owner-function-name"};
       
       const dummyLambda = {};
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("disconnectDialog",dummyPayload,dummyUserData);
       
       assert(callback.called);
       assert.equal(callback.getCall(0).args.length,1);
    });
});

describe("getDialog mixin",()=>{
    it("returns dialog object of the user",()=>{
       const dummyUserId = "dummy-user-id";
       const currentDialogExpires = new Date();
       currentDialogExpires.setSeconds(currentDialogExpires.getSeconds() + 30);
       const dummyUserData = {
           id:dummyUserId,
           dialog:{
               ownerFunction:"dummy-owner-funcation-name",
               expires:currentDialogExpires.toISOString()
           }
       };
       
       const dummyPayload = {};
       
       const dummyLambda = {};
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("getDialog",dummyPayload,dummyUserData);
       
       assert(callback.called);
       assert.deepEqual(callback.getCall(0).args[1],dummyUserData.dialog);
    });
    
    it("returns null if user has no dialog at that time",()=>{
       const dummyUserId = "dummy-user-id";
       const dummyUserData = {
           id:dummyUserId
       };
       
       const dummyPayload = {};
       
       const dummyLambda = {};
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("getDialog",dummyPayload,dummyUserData);
       
       assert(callback.called);
       assert.deepEqual(callback.getCall(0).args.length,0); 
    });
    
    it("deletes dialog object and returns null if the dialog has been expired",()=>{
       const dummyUserId = "dummy-user-id";
       const currentDialogExpires = new Date();
       currentDialogExpires.setSeconds(currentDialogExpires.getSeconds() - 30);
       const dummyUserData = {
           id:dummyUserId,
           dialog:{
               ownerFunction:"dummy-owner-funcation-name",
               expires:currentDialogExpires.toISOString()
           }
       };
       
       const dummyPayload = {};
       
       const dummyLambda = {};
       dummyLambda.invoke = sinon.stub();
       dummyLambda.invoke.onFirstCall().callsArgWith(1,null,null);
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("getDialog",dummyPayload,dummyUserData);
       
       assert(dummyLambda.invoke.called);
       assert.equal(dummyLambda.invoke.getCall(0).args[0]["FunctionName"],STORAGE_FUNCTIONS.SET);
       const invokePayload = JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"]);
       assert.equal(invokePayload.key,"user-" + dummyUserId);
       assert(!invokePayload.value.dialog);
       
       assert(callback.called);
       assert.deepEqual(callback.getCall(0).args.length,0); 
    });
});

describe("setDialogAttr mixin",()=>{
    it("creates first attributes of dialog",()=>{
       const dummyUserId = "dummy-user-id";
       const currentDialogExpires = new Date();
       currentDialogExpires.setSeconds(currentDialogExpires.getSeconds() + 30);
       const dummyUserData = {
           id:dummyUserId,
           dialog:{
               ownerFunction:"dummy-owner-function-name",
               expires:currentDialogExpires.toISOString()
           }
       };
       
       const dummyPayload = {
           key:"testKey",
           value:"testValue",
           ownerFunction:"dummy-owner-function-name"
       };
       
       const dummyLambda = {};
       dummyLambda.invoke = sinon.stub();
       dummyLambda.invoke.onFirstCall().callsArgWith(1,null,null);
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("setDialogAttr",dummyPayload,dummyUserData);
       
       assert(dummyLambda.invoke.called);
       assert.equal(dummyLambda.invoke.getCall(0).args[0]["FunctionName"],STORAGE_FUNCTIONS.SET);
       const invokePayload = JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"]);
       assert.equal(invokePayload.key,"user-" + dummyUserId);
       assert(invokePayload.value.dialog.attributes);
       assert(invokePayload.value.dialog.attributes["testKey"]);
       assert.equal(invokePayload.value.dialog.attributes["testKey"],"testValue");
       
       assert(callback.called);
       assert.equal(callback.getCall(0).args.length,0);
       
    });
    
    it("creates second and later attributes of the dialog",()=>{
       const dummyUserId = "dummy-user-id";
       const currentDialogExpires = new Date();
       currentDialogExpires.setSeconds(currentDialogExpires.getSeconds() + 30);
       const dummyUserData = {
           id:dummyUserId,
           dialog:{
               ownerFunction:"dummy-owner-function-name",
               expires:currentDialogExpires.toISOString(),
               attributes:{
                   testKey:"testValue"
               }
           }
       };
       
       const dummyPayload = {
           key:"testKey2",
           value:"testValue2",
           ownerFunction:"dummy-owner-function-name"
       };
       
       const dummyLambda = {};
       dummyLambda.invoke = sinon.stub();
       dummyLambda.invoke.onFirstCall().callsArgWith(1,null,null);
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("setDialogAttr",dummyPayload,dummyUserData);
       
       assert(dummyLambda.invoke.called);
       assert.equal(dummyLambda.invoke.getCall(0).args[0]["FunctionName"],STORAGE_FUNCTIONS.SET);
       const invokePayload = JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"]);
       assert.equal(invokePayload.key,"user-" + dummyUserId);
       assert(invokePayload.value.dialog.attributes);
       assert(invokePayload.value.dialog.attributes["testKey"]);
       assert.equal(invokePayload.value.dialog.attributes["testKey"],"testValue");
       assert(invokePayload.value.dialog.attributes["testKey2"]);
       assert.equal(invokePayload.value.dialog.attributes["testKey2"],"testValue2");
       
       assert(callback.called);
       assert.equal(callback.getCall(0).args.length,0);
    });
    
    it("updates existing attribute of dialog",()=>{
       const dummyUserId = "dummy-user-id";
       const currentDialogExpires = new Date();
       currentDialogExpires.setSeconds(currentDialogExpires.getSeconds() + 30);
       const dummyUserData = {
           id:dummyUserId,
           dialog:{
               ownerFunction:"dummy-owner-function-name",
               expires:currentDialogExpires.toISOString(),
               attributes:{
                   testKey:"testValue"
               }
           }
       };
       
       const dummyPayload = {
           key:"testKey",
           value:"testValue2",
           ownerFunction:"dummy-owner-function-name"
       };
       
       const dummyLambda = {};
       dummyLambda.invoke = sinon.stub();
       dummyLambda.invoke.onFirstCall().callsArgWith(1,null,null);
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("setDialogAttr",dummyPayload,dummyUserData);
       
       assert(dummyLambda.invoke.called);
       assert.equal(dummyLambda.invoke.getCall(0).args[0]["FunctionName"],STORAGE_FUNCTIONS.SET);
       const invokePayload = JSON.parse(dummyLambda.invoke.getCall(0).args[0]["Payload"]);
       assert.equal(invokePayload.key,"user-" + dummyUserId);
       assert(invokePayload.value.dialog.attributes);
       assert(invokePayload.value.dialog.attributes["testKey"]);
       assert.equal(invokePayload.value.dialog.attributes["testKey"],"testValue2");
       
       assert(callback.called);
       assert.equal(callback.getCall(0).args.length,0); 
    });
    
    it("throws error if user has no dialog at that time",()=>{
       const dummyUserId = "dummy-user-id";
       const currentDialogExpires = new Date();
       currentDialogExpires.setSeconds(currentDialogExpires.getSeconds() + 30);
       const dummyUserData = {
           id:dummyUserId
       };
       
       const dummyPayload = {
           key:"testKey",
           value:"testValue",
           ownerFunction:"dummy-owner-function-name"
       };
       
       const dummyLambda = {};
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("setDialogAttr",dummyPayload,dummyUserData);
       
       assert(callback.called);
       assert(callback.getCall(0).args.length,1);
    });
    
    it("throws error if user has another dialog between other owner function",()=>{
       const dummyUserId = "dummy-user-id";
       const currentDialogExpires = new Date();
       currentDialogExpires.setSeconds(currentDialogExpires.getSeconds() + 30);
       const dummyUserData = {
           id:dummyUserId,
           dialog:{
               ownerFunction:"dummy-another-owner-function-name",
               expires:currentDialogExpires.toISOString()
           }
       };
       
       const dummyPayload = {
           key:"testKey",
           value:"testValue",
           ownerFunction:"dummy-owner-function-name"
       };
       
       const dummyLambda = {};
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("setDialogAttr",dummyPayload,dummyUserData);
       
       assert(callback.called);
       assert(callback.getCall(0).args.length,1);
    });
    
    it("throws error if the dialog has been already expired",()=>{
       const dummyUserId = "dummy-user-id";
       const currentDialogExpires = new Date();
       currentDialogExpires.setSeconds(currentDialogExpires.getSeconds() - 30);
       const dummyUserData = {
           id:dummyUserId,
           dialog:{
               ownerFunction:"dummy-owner-function-name",
               expires:currentDialogExpires.toISOString()
           }
       };
       
       const dummyPayload = {
           key:"testKey",
           value:"testValue",
           ownerFunction:"dummy-owner-function-name"
       };
       
       const dummyLambda = {};
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("setDialogAttr",dummyPayload,dummyUserData);
       
       assert(callback.called);
       assert(callback.getCall(0).args.length,1);
    });
});

describe("getDialogAttr",()=>{
    it("returns value of user attributes identified by the key",()=>{
       const dummyUserId = "dummy-user-id";
       const currentDialogExpires = new Date();
       currentDialogExpires.setSeconds(currentDialogExpires.getSeconds() + 10);
       const dummyUserData = {
           id:dummyUserId,
           dialog:{
               ownerFunction:"dummy-owner-function-name",
               expires:currentDialogExpires.toISOString(),
               attributes:{
                   testKey:"testValue"
               }
           }
       };
       
       const dummyPayload = {
           key:"testKey",
           ownerFunction:"dummy-owner-function-name"
       };
       
       const dummyLambda = {};
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("getDialogAttr",dummyPayload,dummyUserData);
       
       assert(callback.called);
       assert.equal(callback.getCall(0).args[1],"testValue");
    });
    
    it("throws error if user has no dialog at that time",()=>{
       const dummyUserId = "dummy-user-id";
       const currentDialogExpires = new Date();
       currentDialogExpires.setSeconds(currentDialogExpires.getSeconds() + 10);
       const dummyUserData = {
           id:dummyUserId
       };
       
       const dummyPayload = {
           key:"testKey",
           ownerFunction:"dummy-owner-function-name"
       };
       
       const dummyLambda = {};
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("getDialogAttr",dummyPayload,dummyUserData);
       
       assert(callback.called);
       assert.equal(callback.getCall(0).args.length,1);
    });
    
    it("throws error if user has another dialog between other owner function",()=>{
       const dummyUserId = "dummy-user-id";
       const currentDialogExpires = new Date();
       currentDialogExpires.setSeconds(currentDialogExpires.getSeconds() + 10);
       const dummyUserData = {
           id:dummyUserId,
           dialog:{
               ownerFunction:"dummy-another-owner-function-name",
               expires:currentDialogExpires.toISOString(),
               attributes:{
                   testKey:"testValue"
               }
           }
       };
       
       const dummyPayload = {
           key:"testKey",
           ownerFunction:"dummy-owner-function-name"
       };
       
       const dummyLambda = {};
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("getDialogAttr",dummyPayload,dummyUserData);
       
       assert(callback.called);
       assert.equal(callback.getCall(0).args.length,1); 
    });
    
    it("throws error if the dialog has been already expired",()=>{
       const dummyUserId = "dummy-user-id";
       const currentDialogExpires = new Date();
       currentDialogExpires.setSeconds(currentDialogExpires.getSeconds() - 10);
       const dummyUserData = {
           id:dummyUserId,
           dialog:{
               ownerFunction:"dummy-owner-function-name",
               expires:currentDialogExpires.toISOString(),
               attributes:{
                   testKey:"testValue"
               }
           }
       };
       
       const dummyPayload = {
           key:"testKey",
           ownerFunction:"dummy-owner-function-name"
       };
       
       const dummyLambda = {};
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("getDialogAttr",dummyPayload,dummyUserData);
       
       assert(callback.called);
       assert.equal(callback.getCall(0).args.length,1); 
    });
});

describe("mixin resolver",()=>{
    it("throws error if there is no mixin specified by 'functionName' payload",()=>{
       const dummyUserId = "dummy-user-id";
       const currentDialogExpires = new Date();
       currentDialogExpires.setSeconds(currentDialogExpires.getSeconds() + 10);
       const dummyUserData = {
           id:dummyUserId,
           dialog:{
               ownerFunction:"dummy-owner-function-name",
               expires:currentDialogExpires.toISOString(),
               attributes:{
                   testKey:"testValue"
               }
           }
       };
       
       const dummyPayload = {
           key:"testKey",
           ownerFunction:"dummy-owner-function-name"
       };
       
       const dummyLambda = {};
       
       const callback = sinon.spy();
       
       const resolver = mixins.resolveMixin(dummyLambda,STORAGE_FUNCTIONS,callback);
       
       resolver("invalidFunctionName",dummyPayload,dummyUserData);
       
       assert(callback.called);
       assert.equal(callback.getCall(0).args.length,1);
    });
});