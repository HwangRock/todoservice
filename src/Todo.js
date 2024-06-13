import React from 'react';
import { ListItem, ListItemText, InputBase, Checkbox, ListItemSecondaryAction, IconButton, TextField } from '@mui/material';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';

class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            item: props.item, 
            readOnly: true,
            showDetails: false, //세부 내용 표시 상태 추가
        }; // 매개변수 item 의 변수/값을 item에 대입
        this.delete = props.delete;
    }

    deleteEventHandler = () => {
        this.delete(this.state.item);
    }

    toggleDetails = () => {
        this.setState({ showDetails: !this.state.showDetails});
    }

    offReadOnlyMode = () => {
        console.log("Event!", this.state.readOnly);
        this.setState({ readOnly: false }, () => {
            console.log("ReadOnly?", this.state.readOnly);
        });
    }

    enterKeyEventHandler = (e) => {
        if (e.key === "Enter") {
            this.setState({ readOnly: true });
        }
    }

    editEventHandler = (e) => {
        const thisItem = this.state.item;
        thisItem.title = e.target.value;
        this.setState({ item: thisItem });
    }

    editDescriptionHandler = (e) => {
        const thisItem = this.state.item;
        thisItem.description = e.target.value;
        this.setState({ item: thisItem});
    }

    checkboxEventHandler = (e) => {
        console.log("check box event call");
        const thisItem = this.state.item;
        thisItem.done = thisItem.done ? false : true; // thisItem.done = !thisItem.done;
        this.setState({ item: thisItem });
    }

    render() {
        const item = this.state.item;
        return (
            <ListItem>
                <Checkbox
                    checked={item.done}
                    onChange={this.checkboxEventHandler}
                    color="secondary" // 원하는 색상으로 변경
                />
                <ListItemText>
                    <InputBase
                        inputProps={{ 'aria-label': 'naked', readOnly: this.state.readOnly }}
                        type="text"
                        id={item.id}
                        name={item.id}
                        value={item.title}
                        multiline={true}
                        fullWidth={true}
                        onClick={this.offReadOnlyMode}
                        onChange={this.editEventHandler}
                        onKeyPress={this.enterKeyEventHandler}
                        style={{ fontSize: '1em'}} // 글씨 크기 작게 설정
                    />
                    {this.state.showDetails && (
                        <TextField
                            inputProps={{ 'aria-label': 'naked'}}
                            type= "text"
                            value={item.description || ""}
                            multiline = {true}
                            fullWidth={true}
                            onChange={this.editDescriptionHandler}
                            style={{ fontSize: '0.8em', marginTop: '8px'}} //글씨 크기 작게 설정
                        />
                    )}
                </ListItemText>
                <ListItemSecondaryAction>
                    <IconButton aria-label="Toggle Details" onClick = {this.toggleDetails}>
                        <span style={{fontSize: '0.1em'}}></span>
                        {this.state.showDetails ? "Hide" : "Details"}
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={this.deleteEventHandler}>
                        <DeleteOutlined />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

export default Todo;
