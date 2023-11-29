import styles from "./Comment.module.css";
import { Trash, Heart, PencilSimpleLine, X, Check} from "@phosphor-icons/react";
import moment from 'moment';
import { useEffect, useState, useRef } from "react";

export default function Comment(props){
    const [commentText, setCommentText] = useState(props.data.text)
    const [editActive, setEditActive] = useState(false);
    const [textareaHeight, setTextAreaHeight] = useState(0);
    const textHeight = useRef();
    
    useEffect(()=>{
        const taHeight = textHeight.current.getBoundingClientRect().height;
        setTextAreaHeight(taHeight+10)
    }, [])

    const handleDelete = () =>{
        props.onDelete(props.data.id)
    }

    const toggleEdit = () =>{
        setEditActive((prev)=>!prev)
    }

    const handleEdit = () =>{
        let updatedData = props.data
        updatedData["text"]=commentText
        props.onUpdate(updatedData)
        toggleEdit()
    }

    return (
        <div className={styles.commentWrapper}>
            <div className={styles.header}>
            <div className={styles.userData}>
                <div className={styles.userPhoto}></div>
                <div className={styles.userName}>{props.data.author}</div>
                <div className={styles.commentDate}>{moment(new Date(props.data.date)).format("MMM D YYYY, h:mm a")}</div>
            </div>
            <div className={styles.interactionWrapper}>
                <div onClick={toggleEdit} className={styles.edit}><PencilSimpleLine color="#0070F3" size={18} /></div>
                <div onClick={handleDelete} className={styles.delete}><Trash color="red" size={18} /></div>
            </div>
            </div>
            <div style={{rowGap:props.data.image?'8px':'0px'}} className={styles.commentContent}>
                {!editActive && <div ref={textHeight} className={styles.commentText}>{props.data.text}</div>}
                {editActive && (
                    <div className={styles.editCommentWrapper}>
                <textarea style={{height:textareaHeight}} className={styles.editText} onChange={(e)=>setCommentText(e.target.value)} value={commentText}></textarea>
                <div className={styles.buttonWrapper}>
                    <div onClick={toggleEdit} className={styles.cancelEdit}><X color="#f5f5f5" size={18} /></div>
                    <div onClick={handleEdit} className={styles.confirmEdit}><Check color="#f5f5f5" size={18} /></div>
                    </div>
                </div>)}
                {props.data.image && <img src={props.data.image} className={styles.commentImage}></img>}
            </div>
            <div className={styles.commentData}>
                <Heart color="hotpink" size={16} />
                <div className={styles.likes}>
                    {props.data.likes}
                </div>
            </div>
        </div>
    )
}