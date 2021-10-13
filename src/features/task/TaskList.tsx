import React, { useState, useEffect } from "react";
import styles from "./TaskList.module.css";

import { makeStyles, Theme } from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import {
  Button,
  Avatar,
  Badge,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TableSortLabel,
} from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchAsyncDeleteTask,
  selectTasks,
  editTask,
  selectTask,
} from "./taskSlice";
import { selectLoginUser, selectProfiles } from "../auth/authSlice";
import { AppDispatch } from "../../app/store";
import { initialState } from "./taskSlice";
import { SORT_STATE, READ_TASK } from "../types";

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    tableLayout: "fixed",
  },
  button: {
    margin: theme.spacing(3),
  },
  small: {
    margin: "auto",
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const TaskList: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const loginUser = useSelector(selectLoginUser);
  const profiles = useSelector(selectProfiles);
  // tasksのオブジェクトから、オブジェクトのキーの名前を取得
  // tasksの0番目の要素が存在する場合実行する
  const columns = tasks[0] && Object.keys(tasks[0]);

  // ソーティングに関するstate
  const [state, setState] = useState<SORT_STATE>({
    // rowsの属性にはreduxのstoreからtasksに入っている値を割り当てている
    rows: tasks,
    order: "desc",
    activeKey: "",
  });

  // 引数のcolumnはソーティング対象の名前を受け取る
  // 渡されるデータ型は、READ_TASKのキーワードのうち、keyofを使うことによってどれか一つがデータ型になる
  const handleClickSortColumn = (column: keyof READ_TASK) => {
    // 例として、state.order === "desc"はorderの初期値はdescなのでtrueになる
    // column === state.activeKeyはactiveKeyは初期値は空なのでfalseになる
    const isDesc = column === state.activeKey && state.order === "desc";
    // 上でisDescはfalseになるので、下記の条件式は"desc"となる
    const newOrder = isDesc ? "asc" : "desc";
    // ソーティングを行うところ
    // Array.from(state.rows)は、taskの一覧が格納されてある配列のコピーを表す
    // コピーした配列にsortをかけている
    // (a, b)は比較関数。比較対象は各行同士の比較
    const sortedRows = Array.from(state.rows).sort((a, b) => {
      if (a[column] > b[column]) {
        return newOrder === "asc" ? 1 : -1;
      } else if (a[column] < b[column]) {
        return newOrder === "asc" ? -1 : 1;
      } else {
        return 0;
      }
    });

    setState({
      rows: sortedRows,
      order: newOrder,
      activeKey: column,
    });
  };

  // 第二引数のtasksに変化があった場合、rowsのstateをtasksの内容で上書き
  useEffect(() => {
    setState((state) => ({
      ...state,
      rows: tasks,
    }));
  }, [tasks]);

  // stateの内容に応じて、バッジの色を変更する
  const renderSwitch = (statusName: string) => {
    switch (statusName) {
      case "Not started":
        return (
          <Badge variant="dot" color="error">
            {statusName}
          </Badge>
        );
      case "On going":
        return (
          <Badge variant="dot" color="primary">
            {statusName}
          </Badge>
        );
      case "Done":
        return (
          <Badge variant="dot" color="secondary">
            {statusName}
          </Badge>
        );
      default:
        return null;
    }
  };

  // Avatarの画像
  // 引数にuserのIDを数字で受け取る
  const conditionalSrc = (user: number) => {
    const loginProfile = profiles.filter(
      // 引数のuserのIDをもとに、profilesの一覧から、userIDに一致するプロフィールのオブジェクトを検索する
      (prof) => prof.user_profile === user
    )[0];
    // 見つけたオブジェクトの中のimg属性が存在する場合は、そのimg属性を返す。存在しない場合は、undefinedを返す
    return loginProfile?.img !== null ? loginProfile?.img : undefined;
  };

  return (
    <>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        size="small"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => {
          dispatch(
            editTask({
              id: 0,
              task: "",
              description: "",
              criteria: "",
              responsible: loginUser.id,
              status: "1",
              category: 1,
              estimate: 0,
            })
          );
          // initialStateの所から、selectedTaskの属性をとってきて引数で渡す
          dispatch(selectTask(initialState.selectedTask));
        }}
      >
        追加
      </Button>
      {/* tasksの最初の要素のtaskに何かしらの文字列があれば、テーブルのレンダリングを行う */}
      {tasks[0]?.task && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {/* columnsのラベルの内容を一つ一つ展開して、描画したいラベルに一致している場合だけTableCell以下を処理する */}
              {columns.map(
                (column, colIndex) =>
                  (column === "task" ||
                    column === "status" ||
                    column === "category" ||
                    column === "estimate" ||
                    column === "responsible" ||
                    column === "owner") && (
                    <TableCell align="center" key={colIndex}>
                      <TableSortLabel
                        active={state.activeKey === column}
                        direction={state.order}
                        onClick={() => handleClickSortColumn(column)}
                      >
                        <strong>{column}</strong>
                      </TableSortLabel>
                    </TableCell>
                  )
              )}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* rowsを展開してrowに格納 */}
            {state.rows.map((row, rowIndex) => (
              <TableRow hover key={rowIndex}>
                {/* keys(キーワード)の一覧を展開してkeyに格納 */}
                {Object.keys(row).map(
                  (key, colIndex) =>
                    // key(キーワード)の値と一致していた場合、TableCell以下を実行
                    (key === "task" ||
                      key === "status_name" ||
                      key === "category_item" ||
                      key === "estimate") && (
                      <TableCell
                        align="center"
                        className={styles.tasklist__hover}
                        // 行と列の2次元の関係になっている
                        // 行方向のindexと列方向のindexを足して、一意のkey(キーワード)を作成する
                        key={`${rowIndex}+${colIndex}`}
                        onClick={() => {
                          dispatch(selectTask(row));
                          dispatch(editTask(initialState.editedTask));
                        }}
                      >
                        {/* rowはあるtaskのオブジェクト。その中のstatus_nameというキーワードの内容。Not started、On going、Doneという文字列が引数として渡される */}
                        {key === "status_name" ? (
                          renderSwitch(row[key])
                        ) : (
                          <span>{row[key]}</span>
                        )}
                      </TableCell>
                    )
                )}
                <TableCell>
                  <Avatar
                    className={classes.small}
                    alt="resp"
                    // 引数にresponsibleのuserIDを渡す。
                    // 返り値として、userIDに対応するアバター画像のURLパスが返ってくるので、srcに代入する
                    src={conditionalSrc(row["responsible"])}
                  />
                </TableCell>
                <TableCell>
                  <Avatar
                    className={classes.small}
                    alt="owner"
                    src={conditionalSrc(row["owner"])}
                  />
                </TableCell>
                <TableCell align="center">
                  <button
                    className={styles.tasklist__icon}
                    onClick={() => {
                      dispatch(fetchAsyncDeleteTask(row.id));
                    }}
                    disabled={row["owner"] !== loginUser.id}
                  >
                    <DeleteOutlineOutlinedIcon />
                  </button>
                  <button
                    className={styles.tasklist__icon}
                    onClick={() => dispatch(editTask(row))}
                    disabled={row["owner"] !== loginUser.id}
                  >
                    <EditOutlinedIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default TaskList;
