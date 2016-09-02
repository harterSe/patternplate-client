import {createPromiseThunkAction} from './promise-thunk-action';
import highlight from '../utils/highlight';

export default createPromiseThunkAction('HIGHLIGHT_CODE', async payload => {
	try {
		return await highlight(payload);
	} catch (error) {
		error.payload = payload;
		throw error;
	}
});
