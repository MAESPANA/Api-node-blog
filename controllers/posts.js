import {db} from '../db.js'
import jwt from 'jsonwebtoken'

export const getPosts = (req,res) =>{
    const q = req.query.cat 
    ? "select * from post where cat=?"
    : "select * from post"

    db.query(q, [req.query.cat], (err, data) =>{
        if (err) return res.send(err)

        return res.status(200).json(data);
    })
}

export const getPost = (req,res) =>{
   
    const q = " select p.id, `username` , `title`,`desc`,p.img, u.img AS userImg,`cat` ,`date` from user u  JOIN post p ON u.id = p.uid WHERE p.id = ? "
    db.query(q, [req.params.id], (err, data) =>{
        if (err) return res.json(err)

        return res.status(200).json(data[0])
    })
}

export const addPost = (req,res) =>{
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not Authenticated!")

    jwt.verify(token,"jwtkey", (err,userInfo) =>{
        if(err) return res.status(403).json("token is not valid");
        
        const q  = "INSERT INTO post(`title`,`desc`,`img`,`cat`,`date`,`uid`) VALUES (?)"

        const values = [

            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
            req.body.date,
            userInfo.id
        ]

        db.query(q, [values], (err,data) => {
            if(err) return res.status(500).json(err)
            return res.json("Post has been created")
        })
    
    })

};

export const deletePost = (req,res) =>{
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not Authenticated!")

    jwt.verify(token,"jwtkey", (err,userInfo) =>{
        if(err) return res.status(403).json("token is not valid")

        const postId= req.params.id;
        
        const q = "DELETE FROM post WHERE id = ? AND uid = ?"

        db.query(q, [postId, userInfo.id ], (err, data)=>   {
         
            if(err) return res.status(403).json(" you can detele only your post!")
            
            
            return res.json("post has been deleted!")
        })
    })


}

export const updatePost = (req,res) =>{
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not Authenticated!")

    jwt.verify(token,"jwtkey", (err,userInfo) =>{
        if(err) return res.status(403).json("token is not valid");

        const postId = req.params.id
        const q  = 
        "update post set `title` = ?,`desc`= ?,`img`= ?,`cat`= ?,`date`= ? where `id` = ? and `uid` = ?"

        const values = [

            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
            req.body.date,
            
        ]

        db.query(q, [...values, postId,userInfo.id], (err,data) => {
            if(err) return res.status(500).json(err)
            return res.json("Post has been updated.")
        })
    
    })

}
