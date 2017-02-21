import Post from '../models/post.model';
import Comment from '../models/comment.model';
//---------------------Commenting APIS-------------------

function saveComment(req, res, next) {
    var user = req.user;
    var comment = new Comment({
        author: req.user,
        content: req.body.content
    });
    comment.save()
        .then(result => {
            Post.get(req.body.post_id)
                .then((post) => {
                    post.comments.push(comment);
                    post.save()
                        .then(result => {
                            res.json({
                                result: 0,
                                data: comment
                            });
                        })
                        .catch(e => next(e));
                })
                .catch(e => { 
                    return res.json({
                        result: 1,
                        data: e.message
                    })
            });
        })
        .catch(e => {
            return res.json({
                result: 1,
                data: e.message
            })
        });
}


export default {
    saveComment
};