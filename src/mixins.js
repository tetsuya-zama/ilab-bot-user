"use strict";

const EXPIRE_SEC = 60;

exports.resolveMixin = (lambda,STORAGE_FUNCTIONS,callback) => {
    return (funcName,payload,data) =>{
        if(mixins(lambda,STORAGE_FUNCTIONS,callback)[funcName]){
            return mixins(lambda,STORAGE_FUNCTIONS,callback)[funcName](payload,data);
        }else{
            callback("mixin:" + funcName + " doesn't exist");
        }
        
    };
};

const mixins = (lambda,STORAGE_FUNCTIONS,callback) => {
    return {
        setUserAttr : (payload,data) => {
            const key = payload.key;
            const val = payload.value;
            if(!data.attributes){
                data.attributes = {};
            }
            
            data.attributes[key] = val;
            
            updateData(data,lambda,STORAGE_FUNCTIONS,callback);
        },
        getUserAttr : (payload,data) => {
            const key = payload.key;
            if(!data.attributes){
                callback();
            }else if(!data.attributes[key]){
                callback();
            }else{
                callback(null,data.attributes[key]);
            }
        },
        connectDialog : (payload,data) => {
            const ownerFunction = payload.ownerFunction;
            const attributes = payload.attributes;
            
            const now = new Date();
            if(!data.dialog){
                data.dialog = {};
            }
            
            if(new Date(data.dialog.expires).getTime() > now.getTime()){
                callback("user:" + data.id + " has an another dialog now");
            }else{
                const expires = new Date();
                expires.setSeconds(expires.getSeconds() + EXPIRE_SEC);
                data.dialog = {
                    ownerFunction:ownerFunction,
                    expires:expires
                };
                if(attributes){
                    data.dialog.attributes = attributes;
                }
                
                updateData(data,lambda,STORAGE_FUNCTIONS,callback);
                
            }
        },
        expandDialog : (payload,data) => {
            const ownerFunction = payload.ownerFunction;
            
            
            if(!data.dialog){
                callback("user:" + data.id + " has no dialog now");
            }else if(data.dialog.ownerFunction !== ownerFunction){
                callback("user:" + data.id + " has a dialog which related another function now");
            }else{
                const expires = new Date();
                expires.setSeconds(expires.getSeconds() + EXPIRE_SEC);
                
                data.dialog.expires = expires;
                updateData(data,lambda,STORAGE_FUNCTIONS,callback);
            }
        },
        disconnectDialog : (payload,data) => {
            const ownerFunction = payload.ownerFunction;
            if(!data.dialog){
                callback("user:" + data.id + " has no dialog now");
            }else if(data.dialog.ownerFunction !== ownerFunction){
                callback("user:" + data.id + " has a dialog which related another function now");
            }else{
                data.dialog = null;
                updateData(data,lambda,STORAGE_FUNCTIONS,callback);
            }
        },
        getDialog : (payload,data) => {
            const now = new Date();
            
            if(!data.dialog){
                callback();
            }else if(new Date(data.dialog.expires).getTime() < now.getTime()){
                data.dialog = null;
                updateData(data,lambda,STORAGE_FUNCTIONS,callback);
            }else{
                callback(null,data.dialog);
            }
        },
        setDialogAttr : (payload,data) => {
            const key = payload.key;
            const val = payload.value;
            const ownerFunction = payload.ownerFunction;
            
            const now = new Date();
            
            if(!data.dialog){
                callback("user:" + data.id + " has no dialog now");
            }else if(data.dialog.ownerFunction !== ownerFunction){
                callback("user:" + data.id + " has a dialog which related another function now");
            }else if(new Date(data.dialog.expires).getTime() < now.getTime()){
                callback("The dialog has been expired");
            }else{
                if(!data.dialog.attributes){
                    data.dialog.attributes = {};
                }
                data.dialog.attributes[key] = val;
                updateData(data,lambda,STORAGE_FUNCTIONS,callback);
            }
        },
        getDialogAttr : (payload,data) => {
            const key = payload.key;
            const ownerFunction = payload.ownerFunction;
            
            const now = new Date();
            
            if(!data.dialog){
                callback("user:" + data.id + " has no dialog now");
            }else if(data.dialog.ownerFunction !== ownerFunction){
                callback("user:" + data.id + " has a dialog which related another function now");
            }else if(new Date(data.dialog.expires).getTime() < now.getTime()){
                callback("The dialog has been expired");
            }else{
                if(!data.dialog.attributes){
                    callback();
                }else{
                    const val = data.dialog.attributes[key];
                    if(!val){
                        callback();
                    }else{
                        callback(null,val);
                    }
                }
            }
        }
    };
};

const updateData = (data,lambda,STORAGE_FUNCTIONS,callback) => {
    lambda.invoke({
        FunctionName:STORAGE_FUNCTIONS.SET,
        Payload:JSON.stringify({
            key:"user-" + data.id,
            value:data
        })},(err,data) => {
            if(err){
                callback(err);
            }else{
                callback();
            }
        }
    );    
};
