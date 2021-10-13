import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {
  READ_TASK, POST_TASK, TASK_STATE, USER, CATEGORY
} from "../types";

// taskの一覧をgetで取得するための非同期関数
export const fetchAsyncGetTasks = createAsyncThunk("task/getTask", async () => {
    const res = await axios.get<READ_TASK[]>(
      `${process.env.REACT_APP_API_URL}/api/tasks/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  });
// usersの一覧をgetで取得するための非同期関数
export const fetchAsyncGetUsers = createAsyncThunk(
    "task/getUsers",
    async () => {
      const res = await axios.get<USER[]>(
        `${process.env.REACT_APP_API_URL}/api/users/`,
        {
          headers: {
            Authorization: `JWT ${localStorage.localJWT}`,
          },
        }
      );
      return res.data;
    }
  );
// categoryの一覧をgetで取得するための非同期関数
export const fetchAsyncGetCategory = createAsyncThunk(
    "task/getCategory",
    async () => {
      const res = await axios.get<CATEGORY[]>(
        `${process.env.REACT_APP_API_URL}/api/category/`,
        {
          headers: {
            Authorization: `JWT ${localStorage.localJWT}`,
          },
        }
      );
      return res.data;
    }
  );
// 新規にcategoryを作ることができる非同期関数
export const fetchAsyncCreateCategory = createAsyncThunk(
    "task/createCategory",
    async (item: string) => {
      const res = await axios.post<CATEGORY>(
        `${process.env.REACT_APP_API_URL}/api/category/`,
        { item: item },
        {
          headers: {
            Authorization: `JWT ${localStorage.localJWT}`,
          },
        }
      );
      return res.data;
    }
  );
// taskを新規に作る非同期関数
export const fetchAsyncCreateTask = createAsyncThunk(
    "task/createTask",
    async (task: POST_TASK) => {
      const res = await axios.post<READ_TASK>(
        `${process.env.REACT_APP_API_URL}/api/tasks/`,
        task,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.localJWT}`,
          },
        }
      );
      return res.data;
    }
  );
// taskを更新するための非同期関数
export const fetchAsyncUpdateTask = createAsyncThunk(
    "task/updateTask",
    async (task: POST_TASK) => {
      const res = await axios.put<READ_TASK>(
        `${process.env.REACT_APP_API_URL}/api/tasks/${task.id}/`,
        task,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.localJWT}`,
          },
        }
      );
      return res.data;
    }
  );
// taskを削除する際の非同期関数
export const fetchAsyncDeleteTask = createAsyncThunk(
    "task/deleteTask",
    async (id: number) => {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      });
      return id;
    }
  );

export const initialState: TASK_STATE = {
    // task, users, categoryは配列
    tasks: [
        {
          id: 0,
          task: "",
          description: "",
          criteria: "",
          owner: 0,
          owner_username: "",
          responsible: 0,
          responsible_username: "",
          estimate: 0,
          category: 0,
          category_item: "",
          status: "",
          status_name: "",
          created_at: "",
          updated_at: "",
        },
      ],
      editedTask: {
        id: 0,
        task: "",
        description: "",
        criteria: "",
        responsible: 0,
        estimate: 0,
        category: 0,
        status: "",
      },
      selectedTask: {
        id: 0,
        task: "",
        description: "",
        criteria: "",
        owner: 0,
        owner_username: "",
        responsible: 0,
        responsible_username: "",
        estimate: 0,
        category: 0,
        category_item: "",
        status: "",
        status_name: "",
        created_at: "",
        updated_at: "",
      },
      users: [
        {
          id: 0,
          username: "",
        },
      ],
      category: [
        {
          id: 0,
          item: "",
        },
      ],
    };

export const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        // editedTaskを更新するためのaction
        editTask(state, action: PayloadAction<POST_TASK>) {
            state.editedTask = action.payload;
        },
        // selectedTaskを更新するためのaction
        selectTask(state, action: PayloadAction<READ_TASK>) {
            state.selectedTask = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(
            fetchAsyncGetTasks.fulfilled,
            // fetchAsyncGetTasks関数のreturnの値をpayloadとして受け取ることができる
            (state, action: PayloadAction<READ_TASK[]>) => {
              return {
                // 受け取ったtaskの一覧の配列の値をtasksに代入
                ...state,
                tasks: action.payload,
              };
            }
          );
          // 失敗した場合(JWTの有効期限(30分間)が過ぎた場合)
          builder.addCase(fetchAsyncGetTasks.rejected, () => {
              window.location.href = "/";
          });
          builder.addCase(fetchAsyncGetUsers.fulfilled,
            // usersにapiから取得したUSERの配列の値をそのまま代入している
            (state, action: PayloadAction<USER[]>) => {
                return {
                    ...state,
                    users: action.payload,
                };
            });
            builder.addCase(
                fetchAsyncGetCategory.fulfilled,
                // categoryにapiから取得したCATEGORYの配列の値をそのまま代入している
                (state, action: PayloadAction<CATEGORY[]>) => {
                    return {
                        ...state,
                        category: action.payload,
                    };
                }
            );
            builder.addCase(
                fetchAsyncCreateCategory.fulfilled,
                // categoryが配列になっているので、スプレッドで要素を展開して、配列の末尾にcategoryのオブジェクトを追加する
                (state, action: PayloadAction<CATEGORY>) => {
                    return {
                        ...state,
                        category: [...state.category, action.payload],
                    };
                }
            );
            // 失敗した場合(JWTの有効期限(30分間)が過ぎた場合)
            builder.addCase(fetchAsyncCreateCategory.rejected, () => {
                window.location.href = "/";
            });
            builder.addCase(
                fetchAsyncCreateTask.fulfilled,
                // tasksが配列なのでスプレッドで要素を展開して、先頭に作られた新しいtaskのオブジェクトを追加する
                (state, action: PayloadAction<READ_TASK>) => {
                    return {
                        ...state,
                        tasks: [action.payload, ...state.tasks],
                        editedTask: initialState.editedTask,
                    };
                }
            );
            // 失敗した場合(JWTの有効期限(30分間)が過ぎた場合)
            builder.addCase(fetchAsyncCreateTask.rejected, () => {
                window.location.href = "/";
            });
            builder.addCase(
                fetchAsyncUpdateTask.fulfilled,
                // 既存のtasksをmapで一つ一つ展開して、アップデートしたidと一致する要素だけをアップデート後の値にして、それ以外はそのままで配列を作り直してtasksを更新する処理
                (state, action: PayloadAction<READ_TASK>) => {
                    return {
                        ...state,
                        tasks: state.tasks.map((task) => task.id === action.payload.id ? action.payload : task),
                        // 初期化
                        editedTask: initialState.editedTask,
                        selectedTask: initialState.selectedTask,
                    };
                }
            );
            builder.addCase(fetchAsyncUpdateTask.rejected, () => {
                window.location.href = "/";
            });
            builder.addCase(fetchAsyncDeleteTask.fulfilled,
                (state, action: PayloadAction<number>) => {
                    // 既存のtasksの中から、今削除したid以外のオブジェクトで再度配列を組みなおして、tasksを上書きする
                    return {
                        ...state,
                        tasks: state.tasks.filter((task) => task.id !== action.payload),
                        editedTask: initialState.editedTask,
                        selectedTask: initialState.selectedTask,
                    };
                }
            );
            // 失敗した場合(JWTの有効期限(30分間)が過ぎた場合)
            builder.addCase(fetchAsyncDeleteTask.rejected, () => {
                window.location.href = "/";
            });
    },
});

export const {editTask, selectTask} = taskSlice.actions;

export const selectSelectedTask = (state: RootState) => state.task.selectedTask;
export const selectEditedTask = (state: RootState) => state.task.editedTask;
export const selectTasks = (state: RootState) => state.task.tasks;
export const selectUsers = (state: RootState) => state.task.users;
export const selectCategory = (state: RootState) => state.task.category;

export default taskSlice.reducer;