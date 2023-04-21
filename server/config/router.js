import authRouter from './../routes/auth.js';
import userRouter from './../routes/user.js';
import projectRouter from './../routes/project.js';
import classRouter from './../routes/class.js';

export default function (app) {
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
    app.use('/api/projects', projectRouter);
    app.use('/api/classes', classRouter);
}
