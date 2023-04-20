import authRouter from './../routes/auth';
import userRouter from './../routes/user';
import projectRouter from './../routes/project';

export default function (app) {
    app.use('/auth', authRouter);
    app.use('/users', userRouter);
    app.use('/projects', projectRouter);
}
