import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Fab,
  Modal,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchAsyncCreateCategory,
  fetchAsyncUpdateTask,
  fetchAsyncCreateTask,
  selectUsers,
  selectEditedTask,
  selectCategory,
  editTask,
  selectTask,
} from "./taskSlice";
import { AppDispatch } from "../../app/store";
import { initialState } from "./taskSlice";

const useStyles = makeStyles((theme: Theme) => ({
  field: {
    margin: theme.spacing(2),
    minWidth: 240,
  },
  button: {
    margin: theme.spacing(3),
  },
  addIcon: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(2),
  },
  saveModal: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(2),
  },
  paper: {
    position: "absolute",
    textAlign: "center",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const TaskForm: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();

  const users = useSelector(selectUsers);
  const category = useSelector(selectCategory);
  const editedTask = useSelector(selectEditedTask);

  const [open, setOpen] = useState(false);
  const [modalStyles] = useState(getModalStyle);
  const [inputText, setInputText] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // 文字列の長さが0、つまり一つでも空欄がある場合はボタンを無効化する
  const isDisabled =
    editedTask.task.length === 0 ||
    editedTask.description.length === 0 ||
    editedTask.criteria.length === 0;
  //入力フォームが空欄の場合、ボタンを無効化する
  const isCatDisabled = inputText.length === 0;

  const handleInputTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  // taskやdescription、criteriaは文字(string型)を入力するが、estimateは数字(number)を入力するので、両方を動的に対応できるようにする関数
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // valueはstring型かnumber型を受けとれるようにする
    let value: string | number = e.target.value;
    const name = e.target.name;
    // nameが"estimate"ならnumber型に変換して、再度valueに代入する
    if (name === "estimate") {
      value = Number(value);
    }
    // dispatch経由でeditTaskを呼び出し、editedTaskのstateの中のnameで指定された属性をvalueの値で書き換える
    dispatch(editTask({ ...editedTask, [name]: value }));
  };

  // リストの中から値を選択して変更する関数(responsible)
  // Selecterの使用で特定の型付けが出来ないので、ひとまずunknownとしている(後で、型付けする)
  const handleSelectRespChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    // valueの値を特定のデータ型で型付け(この場合、number型に型付けしている)
    const value = e.target.value as number;
    dispatch(editTask({ ...editedTask, responsible: value }));
  };

  const handleSelectStatusChange = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    // statusに関しては、文字列で入力されるので、string型としている
    const value = e.target.value as string;
    dispatch(editTask({ ...editedTask, status: value }));
  };

  const handleSelectCategoryChange = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    // リストから選択されたカテゴリーのIDが数字で渡されるので、number型で型付けしている
    const value = e.target.value as number;
    dispatch(editTask({ ...editedTask, category: value }));
  };

  // const pressEnter = (e: any) => {
  //   if(e.key === "Enter") {
  //     dispatch(fetchPresentations({query: e.target.value}));
  //   }
  // }

  // ユーザー一覧をリストで表示
  // reduxのstateから取ってきたusersをmapで展開してMenuItemを配列の要素分だけ繰り返す
  let userOptions = users.map((user) => (
    <MenuItem key={user.id} value={user.id}>
      {user.username}
    </MenuItem>
  ));

  // reduxのstateから取ってきたcategoryをmapで展開してMenuItemを配列の要素分だけ繰り返す
  let categoryOptions = category.map((cat) => (
    <MenuItem key={cat.id} value={cat.id}>
      {cat.item}
    </MenuItem>
  ));

  return (
    <div>
      {/* editedTaskのuuidに0以外の数字が入っていたら"Update Task"、0なら"New Task" */}
      <h2>{editedTask.id ? "Update Task" : "New Task"}</h2>
      <form>
        <TextField
          className={classes.field}
          label="Estimate [days]"
          type="number"
          name="estimate"
          InputProps={{
            inputProps: { min: 0, max: 1000 },
          }}
          InputLabelProps={{
            shrink: true,
          }}
          value={editedTask.estimate}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="Task"
          type="text"
          name="task"
          value={editedTask.task}
          onChange={handleInputChange}
        />
        <br />
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="Description"
          type="text"
          name="description"
          value={editedTask.description}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="Criteria"
          type="text"
          name="criteria"
          value={editedTask.criteria}
          onChange={handleInputChange}
        />
        <br />
        <FormControl className={classes.field}>
          <InputLabel>Responsible</InputLabel>
          <Select
            name="responsible"
            onChange={handleSelectRespChange}
            value={editedTask.responsible}
          >
            {userOptions}
          </Select>
        </FormControl>
        <FormControl className={classes.field}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            onChange={handleSelectStatusChange}
            value={editedTask.status}
          >
            <MenuItem value={1}>Not Started</MenuItem>
            <MenuItem value={2}>On going</MenuItem>
            <MenuItem value={3}>Done</MenuItem>
          </Select>
        </FormControl>
        <br />
        <FormControl className={classes.field}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            onChange={handleSelectCategoryChange}
            value={editedTask.category}
          >
            {categoryOptions}
          </Select>
        </FormControl>

        <Fab
          size="small"
          color="primary"
          onClick={handleOpen}
          className={classes.addIcon}
        >
          <AddIcon />
        </Fab>

        <Modal open={open} onClose={handleClose}>
          <div style={modalStyles} className={classes.paper}>
            <TextField
              className={classes.field}
              InputLabelProps={{
                shrink: true,
              }}
              label="New Category"
              type="text"
              value={inputText}
              onChange={handleInputTextChange}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.saveModal}
              startIcon={<SaveIcon />}
              disabled={isCatDisabled}
              onClick={() => {
                dispatch(fetchAsyncCreateCategory(inputText));
                handleClose();
              }}
            >
              SAVE
            </Button>
          </div>
        </Modal>
        <br />
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          startIcon={<SaveIcon />}
          disabled={isDisabled}
          // クリックしたとき、editedTaskのidが0じゃなかったら、fetchAsyncUpdateTaskを呼び出す
          // 引数にeditedTaskを編集したいオブジェクトとして渡す
          onClick={
            editedTask.id !== 0
              ? () => dispatch(fetchAsyncUpdateTask(editedTask))
              : () => dispatch(fetchAsyncCreateTask(editedTask))
          }
        >
          {editedTask.id !== 0 ? "Update" : "Save"}
        </Button>
        <Button
          variant="contained"
          color="default"
          size="small"
          // クリックされたとき、reduxのstateの中のeditedTaskとselectedTaskを初期化するために、editTaskとselectTaskを初期値で呼び出す
          onClick={() => {
            dispatch(editTask(initialState.editedTask));
            dispatch(selectTask(initialState.selectedTask));
          }}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default TaskForm;
