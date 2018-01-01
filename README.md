# iLabBotUser

## 概要

iLab Botで相手のユーザー(LINEユーザー)を管理するための関数です。

### 基本

ユーザー情報はuserIdで一意に管理します。
userIdは原則的にLINEのユーザーIDを指定してください。

また、ユーザーごとに任意の属性(attributes)を設定、保存できます。

### 対話(dialog)

iLab Bot内の子Botは、ユーザーに対して対話(dialog)を宣言することができます。
dialogが成立している間、iLab Botのrequest handlerはdialogが成立している子Botにしかリクエストを流しません。
また、他の子Botとのdialogが成立している間は、新たなdialogを成立させることはできません。

dialogは何もしなければ60秒で失効します。ただし、dialogを成立させた子Botのみ、有効期間を延長させることができます。

また、dialogにも任意の属性(dialog attributes)を設定、保存できます。
ただし、dialog attributesはdialogが失効すると消滅してしまうので注意してください。

### mixinについて

Lambda Functionはその名の通り関数であるため、いわゆる"オブジェクト"を返すことはできません。

そのため、ユーザーという"オブジェクト"に対する操作のため、『mixin』という仕様を提供しています。

オブジェクト指向に慣れている方は『mixin』をユーザーオブジェクトに対する"メソッド"と捉えても問題ありません。

関数型に慣れている方は、iLabBotUserという関数と各mixinの関数合成と捉えれば理解しやすいかと思います。

例えば、

```javascript
{
  "userId": "dummy-user-id",
  "mixin": {
    "functionName": "setUserAttr",
    "payload": {
      "key": "testKey",
      "value": "testValue"
    }
  }
}
```

このリクエストは"dummy-user-id"というIDを持つユーザーに対して、key=testKey,value=testValueという属性を追加します。

オブジェクト指向で云えば、例えばJavaで表現すると、

```java
User user = new User("dummy-user-id");
user.setUserAttr("testKey","testValue");
```

のような表現と同等と考えてください。


関数型で云えば、例えばjavascriptで表現すると、

```javascript
setUserAttr(user("dummy-user-id"),"testKey","testValue");
```

のような表現と同等です。

## リファレンス

### 基本(mixinなし)
#### 概要

userIdに紐づくユーザーデータを返す。
ユーザーが存在しない場合は新たに作成（※）、そのデータを返す。

※ この挙動はmixinがある場合も同じです。
例えば、存在しないuserIdを指定してsetUserAttrを実行すると、新たなユーザーデータを作成してそのユーザーに属性を保存します。


#### 利用例

**リクエスト**

```javascript
{
  "userId": "dummy-user-id"
}
```

**レスポンス**

```javascript
{
  "dialog": {
    "ownerFunction": "dummy-owner-function-name",
    "expires": "2018-01-01T03:29:21.109Z",
    "attributes": {
      "testKey": "testValue"
    }
  },
  "attributes": {
    "testKey": "testValue"
  },
  "id": "dummy-user-id"
}
```

### setUserAttr

#### 概要

指定されたユーザーに属性を設定する。
keyが存在しない場合は新たに作成し、すでに存在する場合はその値を上書きする。

#### 利用例

**リクエスト**

```javascript
{
  "userId": "dummy-user-id",
  "mixin": {
    "functionName": "setUserAttr",
    "payload": {
      "key": "testKey",
      "value": "testValue"
    }
  }
}
```

**レスポンス**

```javascript
null
```

### getUserAttr

#### 概要

keyに紐づく属性の値を返す。
存在しない場合はnullを返す。

#### 利用例

**ユーザーデータ**
```javascript
{
  "dialog": null,
  "attributes": {
    "testKey": "testValue"
  },
  "id": "dummy-user-id"
}
```

**リクエスト**
```javascript
{
  "userId": "dummy-user-id",
  "mixin": {
    "functionName": "getUserAttr",
    "payload": {
      "key": "testKey"
    }
  }
}
```

**レスポンス**
```javascript
"testValue"
```

### connectDialog

#### 概要

ユーザーとの対話(dialog)を宣言する。

"ownerFunction"には自身のLambda関数名を指定すること。
以下のようにcontextオブジェクトのfunctionName属性を取得して使用することが望ましい。

**node.js**
```javascript
exports.handler = (event,context,callback){
    //自身のLambda関数名を取得
    const functionName = context.functionName;
}
```

**python**
```python
def lambda_handler(event,context):
    #自身のLambda関数名を取得
    function_name = context.function_name
```

#### 利用例

**リクエスト**
```javascript
{
  "userId": "dummy-user-id",
  "mixin": {
    "functionName": "connectDialog",
    "payload": {
      "ownerFunction": "dummy-owner-function-name"
    }
  }
}
```

**レスポンス**
```javascript
null
```

### expandDialog
#### 概要

すでに成立しているdialogの有効期限を延長する。

"ownerFunction"には自身のLambda関数名を指定すること。

#### 利用例
**リクエスト**
```javascript
{
  "userId": "dummy-user-id",
  "mixin": {
    "functionName": "expandDialog",
    "payload": {
      "ownerFunction": "dummy-owner-function-name"
    }
  }
}
```

**レスポンス**
```javascript
null
```

### disconnectDialog
#### 概要

すでに成立しているdialogを終了する。

"ownerFunction"には自身のLambda関数名を指定すること。

#### 利用例
**リクエスト**
```javascript
{
  "userId": "dummy-user-id",
  "mixin": {
    "functionName": "disconnectDialog",
    "payload": {
      "ownerFunction": "dummy-owner-function-name"
    }
  }
}
```

**レスポンス**
```javascript
null
```

### getDialog
#### 概要

userIdで指定したユーザーのdialogを返す。

dialogが成立していない、もしくは有効期限が切れている場合はnullを返す。

尚、このmixinに"ownerFunction"の指定は不要。

**注意事項**

dialogの有無を確認する場合、「基本(mixinなし)」ではなく、getDialog mixinを利用して確認すること。

「基本(mixinなし)」の場合、"dialog"属性に有効期限切れのdialogも返してしまう。

#### 利用例
**ユーザーデータ**
```javascript
{
  "dialog": {
    "ownerFunction": "dummy-owner-function-name",
    "expires": "2018-01-01T04:09:09.546Z",
    "attributes": {
      "testKey": "testValue"
    }
  },
  "attributes": {
    "testKey": "testValue"
  },
  "id": "dummy-user-id"
}
```

**リクエスト**
```javascript
{
  "userId": "dummy-user-id",
  "mixin": {
    "functionName": "getDialog",
    "payload": {}
  }
}
```
**レスポンス**
```javascript
{
  "ownerFunction": "dummy-owner-function-name",
  "expires": "2018-01-01T04:09:09.546Z",
  "attributes": {
    "testKey": "testValue"
  }
}
```

### setDialogAttr
#### 概要

すでに成立しているdialogに対する属性を設定する。
keyが存在しない場合は新たに作成し、すでに存在する場合はその値を上書きする。

"ownerFunction"には自身のLambda関数名を指定すること。

#### 利用例
**リクエスト**
```javascript
{
  "userId": "dummy-user-id",
  "mixin": {
    "functionName": "setDialogAttr",
    "payload": {
      "ownerFunction": "dummy-owner-function-name",
      "key": "testKey",
      "value": "testValue"
    }
  }
}
```

**レスポンス**
```javascript
null
```

### getDialogAttr
#### 概要

keyに紐づくdialog属性の値を返す。
存在しない場合はnullを返す。

"ownerFunction"には自身のLambda関数名を指定すること。

#### 利用例
**ユーザーデータ**
```javascript
{
  "dialog": {
    "ownerFunction": "dummy-owner-function-name",
    "expires": "2018-01-01T04:09:09.546Z",
    "attributes": {
      "testKey": "testValue"
    }
  },
  "attributes": {
    "testKey": "testValue"
  },
  "id": "dummy-user-id"
}
```

**リクエスト**
```javascript
{
  "userId": "dummy-user-id",
  "mixin": {
    "functionName": "getDialogAttr",
    "payload": {
      "ownerFunction": "dummy-owner-function-name",
      "key": "testKey"
    }
  }
}
```

**レスポンス**
```javascript
"testValue"
```
