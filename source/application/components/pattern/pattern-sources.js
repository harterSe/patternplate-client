import React, {Component, PropTypes as t} from 'react';
import join from 'classnames';
import autobind from 'autobind-decorator';
import md5 from 'md5';

import PatternControl from './pattern-control';
import PatternCode from './pattern-code';
import PatternDocumentation from './pattern-documentation';

export default PatternSources;

function PatternSources(props) {
	const {sources} = props;
	return (
		<div className="pattern-sources">
			{
				sources.map(source => (
					<PatternSource
						active={source.active}
						update={source.update}
						base={props.base}
						concern={source.concern}
						concerns={source.concerns}
						environment={props.environment}
						extname={source.extname}
						id={source.id}
						shortid={source.shortid}
						key={source.shortid}
						language={source.language}
						loading={source.loading}
						location={props.location}
						name={source.name}
						onConcernChange={props.onConcernChange}
						onFileRequest={props.onFileRequest}
						onTypeChange={props.onTypeChange}
						source={source.source}
						type={source.type}
						types={source.types}
						/>
				))
			}
		</div>
	);
}

PatternSources.propTypes = {
	base: t.string.isRequired,
	environment: t.string.isRequired,
	location: t.shape({
		pathname: t.string.isRequired,
		query: t.object.isRequired
	}).isRequired,
	onConcernChange: t.func.isRequired,
	onFileRequest: t.func.isRequired,
	onTypeChange: t.func.isRequired,
	sources: t.arrayOf(t.shape({
		active: t.bool.isRequired,
		concern: t.string.isRequired,
		id: t.string.isRequired,
		language: t.string.isRequired,
		name: t.string.isRequired,
		source: t.string.isRequired,
		type: t.string.isRequired
	}))
};

@autobind
class PatternSource extends Component {
	static propTypes = {
		active: t.bool.isRequired,
		base: t.string.isRequired,
		concern: t.string.isRequired,
		concerns: t.arrayOf(t.string).isRequired,
		environment: t.string.isRequired,
		id: t.string.isRequired,
		shortid: t.string.isRequired,
		loading: t.bool,
		location: t.shape({
			pathname: t.string.isRequired,
			query: t.object.isRequired
		}).isRequired,
		name: t.string.isRequired,
		onFileRequest: t.func.isRequired,
		language: t.string.isRequired,
		source: t.string.isRequired,
		type: t.string.isRequired,
		types: t.arrayOf(t.string).isRequired,
		title: t.string,
		update: t.bool.isRequired
	};

	componentDidMount() {
		const {props} = this;
		if (props.update) {
			props.onFileRequest({
				id: props.id,
				shortid: props.shortid,
				environment: props.environment,
				type: props.type,
				base: props.base
			});
		}
	}

	componentWillUpdate(next) {
		if (next.update) {
			next.onFileRequest({
				id: this.props.id,
				shortid: this.props.shortid,
				environment: this.props.environment,
				type: this.props.type,
				base: this.props.base
			});
		}
	}

	render() {
		const {props} = this;
		const className = join('pattern-source', {
			'pattern-source--loading': props.loading
		});
		const verb = props.active ? `Close` : `View`;
		const title = `${verb} ${props.concern}${props.extname}`;
		return (
			<div className={className}>
				<PatternControl
					active={props.active}
					base={props.base}
					disabled={props.loading}
					expand
					key={props.id}
					location={props.location}
					name={props.name}
					shortid={props.id}
					title={title}
					/>
				{
					props.active && props.language === 'md' &&
						<PatternDocumentation
							base={props.base}
							name={props.name}
							source={props.source}
							/>
				}
				{
					props.active && props.language !== 'md' &&
						<PatternCode
							base={props.base}
							concern={props.concern}
							concerns={props.concerns}
							copy
							extname={props.extname}
							format={props.language}
							highlight
							id={md5([props.id, props.source].join(':'))}
							name={props.name}
							onConcernChange={props.onConcernChange}
							onTypeChange={props.onTypeChange}
							source={props.source}
							type={props.type}
							types={props.types}
							/>
				}
			</div>
		);
	}
}
