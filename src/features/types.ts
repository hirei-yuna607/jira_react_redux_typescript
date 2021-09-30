// authSlice.tsのデータの型定義
export interface LOGIN_USER {
    id: number;
    username: string;
}
// 画像の取り扱い
export interface FILE extends Blob {
    readonly lastModified: number;
    readonly name: string;
}
// プロフィール
export interface PROFILE {
    id: number;
    user_profile: number;
    img: string | null;
}
export interface POST_PROFILE {
    id: number;
    img: File | null;
}
// usernameとpasswordを格納するデータ型
export interface CRED {
    username: string;
    password: string;
}
// JWTトークンのデータ型
export interface JWT {
    refresh: string;
    access: string;
}
// User(一覧)のデータ型
export interface USER {
    id: number;
    username: string;
}
// authSliceで管理するstateのデータ型
export interface AUTH_STATE {
    isLoginView: boolean;
    loginUser: LOGIN_USER;
    profiles: PROFILE[];
}


// taskSlice関連のデータ型定義
// Djangoで指定したパラメータと同じ
// serializerのfieldsと同じ
export interface READ_TASK {
    id: number;
    task: string;
    description: string;
    criteria: string;
    status: string;
    status_name: string;
    category: number;
    category_item: string;
    estimate: number;
    responsible: number;
    responsible_username: string;
    owner: number;
    owner_username: string;
    created_at: string;
    updated_at: string;
  }

  export interface POST_TASK {
    id: number;
    task: string;
    description: string;
    criteria: string;
    status: string;
    category: number;
    estimate: number;
    responsible: number;
  }
// カテゴリーの一覧を格納するためのデータ型
  export interface CATEGORY {
      id: number;
      item: string;
  }

// 配列は一覧を取得するため(tasks, users, category)
export interface TASK_STATE {
    tasks: READ_TASK[];
    editedTask: POST_TASK;
    selectedTask: READ_TASK;
    users: USER[];
    category: CATEGORY[];
}
