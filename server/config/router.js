import authRouter from './../routes/auth.js';
import userRouter from './../routes/user.js';
import projectRouter from './../routes/project.js';
import classRouter from './../routes/class.js';

export default function (app) {
    app.use('/auth', authRouter);
    app.use('/users', userRouter);
    app.use('/projects', projectRouter);
    app.use('/classes', classRouter);
}
