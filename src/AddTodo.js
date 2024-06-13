import React from 'react';
import { TextField, Paper, Button, Grid } from '@mui/material';

class AddTodo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { item: { title: "" } };
        this.add = props.add; // props의 함수를 this.add에 연결, props에는 상위 컴포넌트(App.js)의 함수가 들어 있음.
    }

    onInputChange = (e) => {
        const thisItem = this.state.item;
        thisItem.title = e.target.value;
        this.setState({ item: thisItem });
        console.log(thisItem);
    }

    onButtonClick = () => {
        this.add(this.state.item);
        this.setState({ item: { title: "" } }); // 텍스트 값을 추가하고 입력 필드는 초기화시킴.
    }

    enterKeyEventHandler = (e) => {
        if (e.key === 'Enter') {
            this.onButtonClick();
        }
    }

    render() {
        return (
            <Paper style={{ margin: 16, padding: 16 }}>
                <Grid container spacing={2}>
                    <Grid item xs={11} md={11}>
                        <TextField
                            placeholder="Add Todo here"
                            fullWidth
                            onChange={this.onInputChange}
                            value={this.state.item.title}
                            onKeyDown={this.enterKeyEventHandler} // onKeyPress를 onKeyDown으로 업데이트
                        />
                    </Grid>
                    <Grid item xs={1} md={1}>
                        <Button
                            fullWidth
                            color="secondary"
                            variant="outlined"
                            onClick={this.onButtonClick}
                        >
                            +
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default AddTodo;
