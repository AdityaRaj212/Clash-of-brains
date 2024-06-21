import jwt from 'jsonwebtoken';

const jwtAuth = (req,res,next)=>{
    const token = req.cookies.jwtToken;
    if(!token){
        return res.status(401).send('Unauthorised');
    }

    try{
        const payload = jwt.verify(token,'secret');
        req.userId = payload.userId;
    }catch(err){
        console.log(err);
        res.status(401).send('Unauthorised');
    }

    next();
}

export default jwtAuth;