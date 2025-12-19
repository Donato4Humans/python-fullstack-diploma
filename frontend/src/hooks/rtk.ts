import { useDispatch, useSelector } from 'react-redux';
import { store } from '../redux/store';

export const useAppSelector =
	useSelector.withTypes<ReturnType<typeof store.getState>>();
export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>();