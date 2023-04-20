import authRouter from './../routes/auth';
import userRouter from './../routes/user';
import projectRouter from './../routes/project';
import classRouter from './../routes/class';

export default function (app) {
    app.use('/auth', authRouter);
    app.use('/users', userRouter);
    app.use('/projects', projectRouter);
    app.use('/classes', classRouter);
}
