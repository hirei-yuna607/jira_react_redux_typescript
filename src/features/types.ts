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
