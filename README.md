# はじめに
Nuxt 3フレームワークを使用してWebアプリケーションを開発し、Firebase Authenticationを導入しました。
これにより、ユーザーはGoogleアカウントを利用してアプリケーションにログインすることができます。OAuthと呼ばれる認証プロセスを組み込んでいます。具体的には、ユーザーはGoogleの認証情報を使用してアプリケーションにアクセスし、同時にアプリケーションはユーザーのGoogleアカウント情報を直接知ることなく、ユーザーの同意を得て特定の情報にアクセスできるようになっています。

# 今回作成するもの
- ルーティング
    - /signIn
    - /content
- 説明
    - ルーティングを上記の２ページのみです。
    - /signInは、googleアカウントでサインインするためのページであり、だれでもアクセス可能です。
    - /contentは、googleアカウントでサインインしたユーザーのみアクセス可能です。
- 上記の説明を図にしたもの
    ```mermaid
    sequenceDiagram
    participant user as ユーザー
    participant middleware
    participant signIn as /signIn
    participant firebase
        user ->> signIn: アクセス
        signIn ->> firebase : ログイン
        firebase ->> signIn : 認証情報の付与
        signIn ->> user : /contentへダイレクト
    ```
    ```mermaid
    sequenceDiagram
    participant user as ユーザー
    participant middleware
    participant content as /content
        user ->> middleware : /contentへアクセス
        middleware ->> middleware : 認証情報を持っているか
        
        alt 認証情報をもっている
            middleware ->> content :　アクセス許可
        else 認証情報をもってない
            middleware ->> user : /signInへリダイレクト
        end
    ```

# 環境
```dockerfile:Dockerfile
FROM node:20.10-alpine

WORKDIR /app

EXPOSE 3000
```
```yml:docker-compose.yml
version: '3.9'

services:
  nuxt:
    container_name: nuxt
    build: .
    volumes:
      - ./app:/app:cached
    ports:
      - "3000:3000"
    tty: true
    command: sh -c "npm install  && npm run dev"

```

# プログラム
## composables
- user.ts
    - Firebaseのユーザー情報を管理するためのカスタムフックを定義
    - useStateフックを使ってuserの状態を管理しています。useStateの初期値はnull
    ```typescript:user.ts
    import { type User as firebaseUser } from 'firebase/auth';
    
    type User = {
        user: Ref<firebaseUser | null>;
        setUser: (newUser: firebaseUser | null) => void;
    };
    
    export const useUser = (): User => {
        const user = useState<firebaseUser | null>("user", () => null);
    
        const setUser = (newUser: firebaseUser | null) => {
            user.value = newUser;
        };
    
        return {
            user,
            setUser
        };
    };
    ```
- - - 
- auth.ts
    - useAuth関数は、signInとsignOutという2つの関数を持つオブジェクトを返します。
    - signIn関数は、Googleの認証プロバイダを使用してユーザーをサインインします。サインインが成功すると、結果のユーザー情報をsetUser関数を使って更新します。
    - signOut関数は、ユーザーをサインアウトします。サインアウトが成功すると、setUser関数を使ってユーザー情報をnullに更新します。
    ```typescript:auth.ts
    import {
        getAuth,
        GoogleAuthProvider,
        signInWithPopup,
        signOut as firebaseSignOut,
        type UserCredential
    } from 'firebase/auth'
    import { useUser } from '../composables/user'
    
    type Auth = {
        signIn: () => Promise<void>
        signOut: () => Promise<void>
    }
    
    export const useAuth = (): Auth => {
        const { setUser } = useUser()
    
        const signIn = async (): Promise<void> => {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider)
                .then((result: UserCredential) => {
                    setUser(result.user);
                })
                .catch((error) => {
                    console.log(error);
                    alert(error.message);
                });
        };
    
        const signOut = async (): Promise<void> => {
            const auth = getAuth();
            await firebaseSignOut(auth)
                .then(() => {
                    setUser(null);
                })
                .catch((error) => {
                    console.log(error);
                    alert(error.message);
                });
        };
    
        return {
            signIn,
            signOut
        }
    }
    ```
## middleware
- useUserフックを使って現在のユーザー情報を取得し、そのvalueプロパティが存在しない（つまり、ユーザーが認証されていない）場合、ユーザーを/signInルートにリダイレクトします。
```typescript:auth.global.ts
import type { RouteLocationNormalized } from "vue-router";
import { useUser } from "~/composables/user";

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
    if (to.path == '/signIn') return;

    const { user } = useUser();

    if (!user.value) {
        console.log('not authenticated')
        return await navigateTo('/signIn')
    }
});
```
## pages
- /signIn
    - useAuthフックをインポートし、そのsignIn関数を呼び出すsignIn関数を定義
    - signIn関数の実行が完了した後に/contentルートに遷移します。
    ```vue:pages/signIn
    <template>
        <div>
            <h1>signIn page </h1>
            <button @click="signIn()">signIn</button>
        </div>
    </template>
    <script setup lang="ts">
    import { useAuth } from '../composables/auth';
    
    const signIn = async (): Promise<void> => {
        await useAuth().signIn();
        await navigateTo('/content')
    }
    </script>
    ```
    <br>
- /content
    - ユーザーのuid、email、displayNameを表示しています。
    - seAuthとuseUserフックをインポートし、そのsignOut関数を呼び出すsignOut関数を定義
    - signOut関数の実行が完了した後に/signInルートに遷移します。
    ```vue:pages/content
    <template>
        <div>
            <h1>content page</h1>
            <p>uid :{{ user?.uid }}</p>
            <p>email : {{ user?.email }}</p>
            <p>displayName : {{ user?.displayName }}</p>
            <button @click="signOut">signOut</button>
        </div>
    </template>
    <script setup lang="ts">
    import { useAuth } from "../composables/auth";
    import { useUser } from "../composables/user";
    
    const { user } = useUser();
    
    const signOut = async (): Promise<void> => {
        await useAuth().signOut();
        await navigateTo('/signIn')
    }
    </script>
    ```

# 動作
- /signIn
<img src="/img/signIn.png">
<img src="/img/google_popup.png">

- /contet
    - googleアカウントにログインすることで/contentにアクセスでき、uidとemail,displayNameを参照することができる。
<img src="/img/content.png">

# まとめ
Nuxt 3フレームワークを使用してWebアプリケーションを開発し、Firebase Authenticationを導入しました。

Firebase Hostingにデプロイしたので、以下のリンクから実際の動作を確認できます
https://nuxt3-ec8df.web.app/　

