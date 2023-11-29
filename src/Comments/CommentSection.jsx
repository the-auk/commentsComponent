import styles from "./CommentSection.module.css";
import Comment from "./Comment";
import COMMENTS from "../data"
import { useEffect, useState, useRef } from "react";
import { CaretLeft, CaretRight, Paperclip } from "@phosphor-icons/react";

export default function CommentSection(){
    const [commentData, setCommentData] = useState(COMMENTS.comments);
    const [renderData, setRenderData] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [newCommentPhoto, setNewCommentPhoto] = useState('');
    const [lastId, setLastId] = useState(COMMENTS.comments[COMMENTS.comments.length-1].id)
    const [currentPage, setCurrentPage] = useState(1);
    const photoUploadRef = useRef()

    const handleDeleteComment = (id) => {
        const updatedData = commentData.filter((comment)=>comment.id!=id)
        setCommentData(updatedData)
    }

    const handleAddComment = () => {
        setCommentData((prev)=>{
            return [...prev,
                {"id":lastId+1, "author":"Admin", "text":newComment, "date":new Date(),"likes":0,"image":newCommentPhoto}
            ]
        })
        setLastId((prev)=>{return prev+1})
        setNewComment('')
        setNewCommentPhoto('')
    }

    const handleEditComment = (updatedComment) => {
        const updatedList = commentData.map((comment)=>{
            if (comment.id==updatedComment.id){
                return {...comment, text:updatedComment.text}
            }
            return comment
        })
        setCommentData(updatedList)
    }

    const handleUpload = (e) => {
        setNewCommentPhoto(URL.createObjectURL(e.target.files[0]));
    }

    useEffect(()=>{
        if(Math.ceil(commentData.length/5)<currentPage){
            setCurrentPage((prev)=>prev-1)
        }
        let tempData = []
        commentData.forEach((comment, index)=>{ 
            if(index>=(currentPage-1)*5 && index<(currentPage)*5){
                tempData.push(comment)
            }
        })
        setRenderData(tempData)
    }, [currentPage, commentData])

    return (
        <div className={styles.commentsSectionWrapper}>
            <div className={styles.maxContainer}>
                <div className={styles.newCommentWrapper}>
                    <div className={styles.header}>
                        <div className={styles.userPhoto}>
                        </div>
                        <div className={styles.userName}>Admin</div>
                    </div>
                    <textarea placeholder="Leave a Comment" className={styles.input} value={newComment} onChange={(e)=>setNewComment(e.target.value)}></textarea>
                    {newCommentPhoto && <img style={{maxWidth:'200px', borderRadius:'12px'}} src={newCommentPhoto} />}
                    <div className={styles.buttonWrapper}>
                        <input style={{display:"none"}} ref={photoUploadRef} type="file" onChange={handleUpload} />
                        <div onClick={()=>photoUploadRef.current.click()} className={styles.photoUploadButton}><Paperclip size={20} /></div>
                        <div onClick={handleAddComment} className={styles.submit}>Post Comment</div>
                        </div>
                </div>
                {commentData.length>0 && <div className={styles.pagination}>
                    {currentPage!=1 && <div onClick={()=>setCurrentPage((prev)=>prev-1)} className={styles.pageButton}>
                    <CaretLeft size={20} /></div>}
                    Page {currentPage} / {Math.ceil(commentData.length/5)}
                    {currentPage!=Math.ceil(commentData.length/5) && <div onClick={()=>setCurrentPage((prev)=>prev+1)} className={styles.pageButton}>
                    <CaretRight size={20} /></div>}
                </div>}
                {renderData?.map((comment)=>{
                    return (
                        <Comment onUpdate={handleEditComment} onDelete={handleDeleteComment} key={comment.id} data={comment} />
                    )
                })}
            </div>
        </div>
    )
}