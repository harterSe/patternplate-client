import {memoize, noop} from 'lodash';
import getError from './get-error';

export default memoize((onLoad = noop, onError = noop) => {
	return e => {
		const document = e.target.contentWindow.document;
		const {body} = document;
		const first = body.firstChild;

		if (!first || !first.innerText) {
			return onLoad(e);
		}

		const lines = first.innerText.split('\n');

		if (lines[0].startsWith('Message: Error in')) {
			const error = getError(lines);
			return onError(error);
		}

		return onLoad(e);
	};
});
