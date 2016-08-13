import React, {PropTypes as types} from 'react';
import {Link} from 'react-router';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import pure from 'pure-render-decorator';
// import autobind from 'autobind-decorator';
// import {merge} from 'lodash';
import urlQuery from '../../utils/url-query';

import 'isomorphic-fetch';

import Pattern from './index';
import PatternLoader from './pattern-loader';
import Icon from '../common/icon';

import getAugmentedChildren from '../../utils/augment-hierarchy';

function getPatternContent(type, data, properties, state) {
	const {location} = properties;

	if (type === 'pattern') {
		const patternData = Array.isArray(data) ?
			data[0] :
			data;

		return [
			patternData && <Pattern
				{...patternData}
				environment={properties.environment}
				key={patternData.id}
				config={properties.config}
				location={properties.location}
				/>,
			<PatternLoader hidden={Boolean(data)} {...state} key="loader"/>
		].filter(Boolean);
	}

	if (type === 'folder') {
		const {folders, patterns} = getAugmentedChildren(
			data.children,
			properties.config.hierarchy
		);

		const rows = Object.values(folders.concat(patterns)).map(child => {
			const {type, displayName, id, manifest = {}} = child;
			const {options = {}, tags = [], flag} = manifest;
			const {hidden = false} = options;

			if (hidden) {
				return null;
			}

			const splat = id;
			const patternLink = ['/pattern', splat].join('/');

			if (type === 'pattern') {
				return (
					<tr key={id}>
						<td>
							<Link
								to={{
									pathname: patternLink,
									query: location.query
								}}
								title={`Navigate to pattern ${splat}`}
								>
								<Icon symbol="pattern"/>
								{displayName}
							</Link>
						</td>
						<td>
							{child.manifest.version}
						</td>
						<td>
							{tags.map((tag, key) =>
								<Link
									to={{
										pathname: location.pathname,
										query: {...location.query, search: `tag:${tag}`}
									}}
									key={key}
									className="pattern-tag"
									title={`Search patterns with tag ${tag}`}
									>
									{tag}
								</Link>
							)}
						</td>
						<td>
							{
								flag &&
									<Link
										to={{
											pathname: location.pathname,
											query: {...location.query, search: `flag:${flag}`}
										}}
										title={`Search patterns with flag ${flag}`}
										className={`pattern__flag pattern__flag--${flag}`}
										>
										{flag}
									</Link>
							}
						</td>
						<td>
							<a
								href={`/demo/${id}`}
								target="_blank"
								title={`Show pattern ${id} in fullscreen`}
								rel="nofollow"
								>
								<Icon symbol="fullscreen"/>
								<span>Fullscreen</span>
							</a>
						</td>
					</tr>
				);
			}
			return (
				<tr key={id}>
					<td colSpan={5}>
						<Link
							to={{
								pathname: patternLink,
								query: location.query
							}}
							title={`Navigate to folder ${id}`}
							>
							<Icon symbol="folder"/>
							{displayName}
						</Link>
					</td>
				</tr>
			);
		});

		const up = data.id.split('/').slice(0, -1).join('/');
		const upLink = [`/pattern`, up].join('/');
		const nested = up.split('/').filter(Boolean).length > 0;

		return (
			<table className="pattern-folder">
				<tbody>
					{nested &&
						<tr key="up">
							<td colSpan={5}>
								<Link
									to={{
										pathname: upLink,
										query: location.query
									}}
									title={`Navigate up to ${upLink}`}
									>
									<Icon symbol="folder"/>
									..
								</Link>
							</td>
						</tr>
					}
					{rows}
				</tbody>
			</table>
		);
	}

	return null;
}

function getFolder(navigation, id) {
	return id.split('/')
		.filter(Boolean)
		.reduce((registry, fragment) => {
			if (!registry) {
				return registry;
			}

			const item = registry.children ? registry.children[fragment] : registry[fragment];

			if (!item) {
				return null;
			}

			if (item.type !== 'folder') {
				return null;
			}

			return item;
		}, navigation);
}

@pure
class PatternSection extends React.Component {
	displayName = 'PatternSection';
	state = {
		data: null,
		error: false,
		type: null
	};

	static propTypes = {
		id: types.string.isRequired,
		data: types.object,
		config: types.object.isRequired,
		environment: types.string.isRequired,
		location: types.object.isRequired
	};

	static defaultProps = {
		environment: 'index'
	};

	async get(props) {
		const {navigation, config} = props;

		// check if this is a pattern or folder
		const id = props.id.split('/').filter(Boolean).join('/');
		const folder = getFolder(navigation, id);
		const type = folder ? 'folder' : 'pattern';

		if (type === 'folder' && config.useFolderTable) {
			this.setState({
				data: folder,
				error: false,
				type: 'folder'
			});
			return;
		}

		const url = urlQuery.format({
			pathname: `/api/pattern/${id}.json`,
			query: {environment: props.environment}
		});

		let response;
		let data;

		try {
			response = await global.fetch(url, {
				headers: {
					Accept: 'application/json'
				},
				credentials: 'include'
			});
		} catch (err) {
			this.setState({
				data: null,
				error: true,
				type: null
			});
			// this.props.eventEmitter.emit('error', `${err.message} ${url}`);
			return;
		}

		try {
			if (response.status >= 400) {
				// Try to get a meaningful error message
				let message;
				try {
					data = await response.json();
					message = data.message || response.statusText;
				} catch (error) {
					message = `${response.statusText} ${url}`;
				}
				throw new Error(message);
			}
		} catch (error) {
			this.setState({
				data: null,
				error: true,
				type: null
			});
			// this.props.eventEmitter.emit('error', `${error.message}`);
			return;
		}

		try {
			const data = await response.json();
			if (data.id !== id) {
				return;
			}
			this.setState({
				data,
				error: false,
				type: 'pattern'
			});
		} catch (err) {
			this.setState({
				data: null,
				error: true,
				type: null
			});
			// this.props.eventEmitter.emit('error', `Could not parse data for ${url}`);
		}
	}

	componentWillMount() {
		this.setState({
			data: this.props.data,
			type: 'pattern'
		});
	}

	componentDidMount() {
		if (!this.state.data) {
			this.get(this.props);
		}
	}

	componentWillReceiveProps(props) {
		if (props.id !== this.props.id) {
			this.setState({
				data: null,
				type: 'pattern'
			});
			this.get(props);
			return;
		}

		if (props.environment !== this.props.environment) {
			this.get(props);
			return;
		}
	}

	/* @autobind
	handleEnvironmentChange(environment) {
		if (environment !== this.props.environment) {
			this.get(merge({}, this.props, {environment}));
		}
	} */

	render() {
		const {location} = this.props;
		const {type, data} = this.state;

		const fragments = this.props.id.split('/');
		const paths = fragments
			.map((fragment, index) => {
				return {
					name: fragment,
					path: fragments.slice(0, index + 1).join('/')
				};
			});

		const content = getPatternContent(type, data, this.props, this.state);

		return (
			<section className="pattern-section">
				<CSSTransitionGroup
					component="ul"
					transitionName="pattern-content-transition"
					key="breadcrumbs"
					className="pattern-breadcrumbs"
					transitionEnterTimeout={300}
					transitionLeaveTimeout={300}
					transitionLeave={false}
					>
					{paths.map(path => {
						return (
							<li className="pattern-breadcrumb" key={path.name}>
								<Link
									to={{
										pathname: ['/pattern', path.path].join('/'),
										query: location.query
									}}
									title={`Navigate to ${path.path}`}
									>
									<span>{path.name}</span>
								</Link>
							</li>
						);
					})}
				</CSSTransitionGroup>
				{content}
			</section>
		);
	}
}

export default PatternSection;
