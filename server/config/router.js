import authRouter from './../routes/auth';
import userRouter from './../routes/user';

export default function (app) {
    app.user('/auth', authRouter);
    app.user('/users', userRouter);
}
