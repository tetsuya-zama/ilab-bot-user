"use strict";

const AWS = require("aws-sdk");
const lambda = new AWS.Lambda();

const mixins = require("./mixins");

const ILAB_BOT_STORAGE_GET = process.env.ILAB_BOT_STORAGE_GET;
const ILAB_BOT_STORAGE_SET = process.env.ILAB_BOT_STORAGE_SET;
const ILAB_BOT_STORAGE_UNSET = process.env.ILAB_BOT_STORAGE_UNSET;

const STORAGE_FUNCTIONS = {
    SET : ILAB_BOT_STORAGE_SET,
    GET : ILAB_BOT_STORAGE_GET,
    UNSET : ILAB_BOT_STORAGE_UNSET
};


const factory = (lambda,STORAGE_FUNCTIONS,mixins) => {
    return (event,context,callback) => {
        const userId = event.userId;
        
        if(!userId){
            callback("Invalid arguments. 'userId' is required");
        }else{
            const resolveMixin = mixins.resolveMixin(lambda,STORAGE_FUNCTIONS,callback);
            //すでにユーザーが保存されているかどうかの判断
            lambda.invoke({
                FunctionName:STORAGE_FUNCTIONS.GET,
                Payload:JSON.stringify({key:"user-" + userId})
            },(err,data)=>{
               if(err){
                   callback(err);
               } else {
                   const payload = JSON.parse(data.Payload);
                   if(payload){
                       //ユーザーがすでにいる場合
                       if(event.mixin){
                           //mixinが指定されていればmixinを実行
                           resolveMixin(event.mixin.functionName,event.mixin.payload,payload);
                       }else{
                           //mixinがなければユーザーデータを返す
                           callback(null,payload);
                       }
                   }else{
                      //ユーザーが未登録の場合
                      const userData = {id:userId};
                      //ユーザーを登録
                      lambda.invoke(
                      {
                          FunctionName:STORAGE_FUNCTIONS.SET,
                          Payload:JSON.stringify({key:"user-" + userId,value:userData})
                          
                      },
                      (err,data) => {
                              if(err){
                                callback(err);
                              }else{
                                //登録成功
                                if(event.mixin){
                                    //mixinが指定されていればmixin実行
                                    resolveMixin(event.mixin.functionName,event.mixin.payload,userData);
                                }else{
                                    //mixinがなければユーザーデータを返す
                                    callback(null,userData);
                                }
                              }
                      });
                   }
               }
            });
        }
    };
};

exports.factory = factory;

exports.handler = factory(lambda,STORAGE_FUNCTIONS,mixins);