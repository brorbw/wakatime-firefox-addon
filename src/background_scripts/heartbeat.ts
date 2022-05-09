// {
//   "entity": <string: entity heartbeat is logging time against, such as an absolute file path or domain>,
//   "type": <string: type of entity; can be file, app, or domain>,
//   "category": <string: category for this activity (optional); normally this is inferred automatically from type; can be coding, building, indexing, debugging, browsing, running tests, writing tests, manual testing, writing docs, code reviewing, researching, learning, or designing>,
//   "time": <float: UNIX epoch timestamp; numbers after decimal point are fractions of a second>,
//   "project": <string: project name (optional)>,
//   "branch": <string: branch name (optional)>,
//   "language": <string: language name (optional)>,
//   "dependencies": <string: comma separated list of dependencies detected from entity file (optional)>,
//   "lines": <integer: total number of lines in the entity (when entity type is file)>,
//   "lineno": <integer: current line row number of cursor with the first line starting at 1 (optional)>,
//   "cursorpos": <integer: current cursor column position starting from 1 (optional)>,
//   "is_write": <boolean: whether this heartbeat was triggered from writing to a file (optional)>,
// }
//
// Notes. Only use for GH. Parse project and branch from URL. Activity as well.
// constructor(entity, type, category, time, project, branch, language, dependencies, lines, lineno, cursorpos, is_write) {
// 	this.entity = entity;
// 	this.type = type;
// 	this.category = category;
// 	this.time = time;
// 	this.project = project;
// 	this.branch = branch;
// 	this.language = language;
// 	this.dependencies = dependencies;
// 	this.lines = lines;
// 	this.lineno = lineno;
// 	this.cursorpos = cursorpos;
// 	this.is_write = is_write;
// }
export class Heartbeat {
	entity: string;
	type: string;
	time: number;
	project: string;
	branch: string;
	language: string;
	constructor(entity: string, type: string, time: number, branch: string, project: string, language: string) {
		this.entity = entity;
		this.type = type;
		this.time = time / 1000; // because wakatimes api is in seconds afaict
		this.branch = branch;
		this.project = project
		this.language = language
	}
}
