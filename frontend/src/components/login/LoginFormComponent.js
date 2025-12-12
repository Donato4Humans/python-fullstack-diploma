import React from 'react';
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {authService} from "../../services/authService";
import "./LoginFormComponent.css";

const LoginFormComponent = () => {
   const {register, handleSubmit, reset} = useForm();
    const navigate = useNavigate();

    const onSubmit = async (user) => {
        try {
            await authService.login(user);

            const {data} = await authService.getMe();

            if (data.is_staff) {
                navigate('/admin');
            } else if (data.is_venue_owner) {
                navigate('/venues');
            } else if (data.is_user) {
                navigate('/venues');
            }else{
                navigate('/venues');
            }
            reset();
        } catch (e) {
            console.error(e);
        }
    }

    return (
            <div className={'login-to-the-chat'}>
                <form className={'form-login'} onSubmit={handleSubmit(onSubmit)}>
                    <input className={'input-login'} type={'text'} placeholder={'Email'} {...register('email')} />
                    <input className={'input-login'} type={'text'} placeholder={'Password'} {...register('password')} />
                    <button className={'button-login'} type={'submit'}>LOGIN</button>
                </form>
            </div>
    );

};

export {
    LoginFormComponent
};