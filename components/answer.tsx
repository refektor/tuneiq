import { useState } from "react";
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { Clear, Check } from '@material-ui/icons';

export default function AnswerItem(props) {
    const [selected, setSelected] = useState(false);

    function itemClicked() {
        if (props.disabled) {
            return;
        }
        setSelected(true);
        props.onClick(props.isCorrect);
    }

    function getIcon() {
        if (props.isCorrect) {
            return <Check/>;
        } else {
            return <Clear/>;
        }
    }

    function getItemContent() {
        return (<>
            {selected && <ListItemIcon>{getIcon()}</ListItemIcon>}
            <ListItemText primary={props.displayText} />
        </>);
    }

    function getItem() {
        if (props.disabled) {
            return (
                <ListItem onClick={itemClicked} selected={selected}>
                    {getItemContent()}
                </ListItem>
            )
        } else {
            return (
                <ListItem button onClick={itemClicked} selected={selected}>
                    {getItemContent()}
                </ListItem>
            )
        }
    }

    return getItem();
}