import React, {PropTypes as t} from 'react';
import urlQuery from '../../utils/url-query';
import Pattern from './index';

const defaultManifest = {
	name: '',
	version: '0',
	display: true,
	patterns: {},
	availableEnvironments: [],
	demoEnvironments: []
};

export default function PatternContent(props) {
	const {base, data, config, location} = props;
	const environment = urlQuery.parse(location.pathname).query.environment;

	if (!data || !data.manifest) {
		return <div/>;
	}

	return (
		<Pattern
			base={base}
			id={data.id || props.id}
			manifest={data.manifest || defaultManifest}
			loading={data.loading}
			reloading={data.reloading}
			results={data.results}
			environment={environment}
			key={data.id}
			config={config}
			location={location}
			onDataRequest={props.onDataRequest}
			/>
	);
}

PatternContent.propTypes = {
	base: t.string.isRequired,
	id: t.string.isRequired,
	data: t.object,
	config: t.object.isRequired,
	location: t.shape({
		query: t.object.isRequired
	}).isRequired,
	onDataRequest: t.func.isRequired
};

PatternContent.defaultProps = {
	onDataRequest: () => {},
	data: {}
};