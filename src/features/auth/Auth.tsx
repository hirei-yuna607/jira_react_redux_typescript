import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";

import styles from "./Auth.module.css";
import { AppDispatch } from "../../app/store";
import {
  toggleMode,
  fetchAsyncLogin,
  fetchAsyncRegister,
  selectIsLoginView,
  fetchAsyncCreateProf,
} from "./authSlice";

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    margin: theme.spacing(3),
  },
}));

const Auth: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const isLoginView = useSelector(selectIsLoginView);

  // usernameとpasswordの属性をもったオブジェクト
  const [credential, setCredential] = useState({ username: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ユーザーが入力した値を取得し、valueに格納
    const value = e.target.value;
    // 上記で定義した、username、passwordを取得してきてnameに格納
    const name = e.target.name;
    // 例えば、usernameの値を変更したい場合、credentialのstateを分割して(スプレッドで展開して)、[name]:で更新したい属性(usernameかpassword)の名前を変数で定義。
    // 更新したい属性を定義した後、valueの値で書き換える。(usernameを指定し(name)、usernameの値を変更する(value))
    setCredential({ ...credential, [name]: value });
  };

  // 非同期関数にアクセス(dispatch)するので、asyncを書く
  const login = async () => {
    // ログインモードかレジスターモードの判定
    if (isLoginView) {
      // ログイン処理の非同期関数を呼び出す
      await dispatch(fetchAsyncLogin(credential));
    } else {
      // レジスターの非同期関数を呼び出す
      const result = await dispatch(fetchAsyncRegister(credential));
      // resultの結果が正常終了した場合(バックエンドと結果が同じだった場合)
      if (fetchAsyncRegister.fulfilled.match(result)) {
        // ログイン処理に移る
        await dispatch(fetchAsyncLogin(credential));
        // 新規に作成したユーザのプロフィールを作成
        await dispatch(fetchAsyncCreateProf());
      }
    }
  };

  return (
    <div className={styles.auth__root}>
      <h1>{isLoginView ? "ログイン" : "新規登録"}</h1>
      <br />
      <TextField
        InputLabelProps={{
          shrink: true,
        }}
        label="UserName"
        type="text"
        name="username"
        value={credential.username}
        onChange={handleInputChange}
      />
      <br />
      <TextField
        InputLabelProps={{
          shrink: true,
        }}
        label="Password"
        type="password"
        name="password"
        value={credential.password}
        onChange={handleInputChange}
      />
      <Button
        variant="contained"
        color="primary"
        size="small"
        className={classes.button}
        onClick={login}
      >
        {isLoginView ? "ログイン" : "新規登録"}
      </Button>
      <span onClick={() => dispatch(toggleMode())}>
        {isLoginView ? "Create New Account" : "Back To Login"}
      </span>
    </div>
  );
};

export default Auth;
