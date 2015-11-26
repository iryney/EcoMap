"""Module contains routes, used for problem table."""
import functools
import json

from flask import request, jsonify, Response, g, abort
from flask_login import login_required

from ecomap import validator
from ecomap.app import app, logger
from ecomap.db import util as db


@app.route('/api/problems', methods=['GET'])
def problems():
    """
    Function, used to get all problems.
    :return: list of problems with id, title, latitude, longtitude,
    problem type, status and date of creation
    """
    problem_tuple = db.get_all_problems()
    parsed_json = []
    if problem_tuple:
        for problem in problem_tuple:
            parsed_json.append({
                'problem_id': problem[0], 'title': problem[1],
                'latitude': problem[2], 'longtitude': problem[3],
                'problem_type_Id': problem[4], 'status': problem[5],
                'date': problem[6]})
    return Response(json.dumps(parsed_json), mimetype='application/json')


@app.route('/api/problem_detailed_info/<int:problem_id>', methods=['GET'])
def detailed_problem(problem_id):
    """
    This method returns json object with detailed problem data.
    :params problem_id - id of selected problem
    :return json with detailed info about problem
    """
    problem_tuple = db.get_problem_by_id(problem_id)
    activity_tuple = db.get_activity_by_problem_id(problem_id)
    parsed_json = []
    problem_info = []
    activity_info = []
    photo_info = []
    parsed_json.append(problem_info)
    parsed_json.append(activity_info)
    parsed_json.append(photo_info)
    if problem_tuple:
        problem_info.append({
            'problem_id': problem_tuple[0], 'title': problem_tuple[1],
            'content': problem_tuple[2], 'proposal': problem_tuple[3],
            'severity': problem_tuple[4], 'status': problem_tuple[5],
            'latitude': problem_tuple[6], 'longtitude': problem_tuple[7],
            'problem_type_id': problem_tuple[8]
            })

    if activity_tuple:
        activity_info.append({
            'created_date': activity_tuple[0], ' problem_id': activity_tuple[1],
            'user_id': activity_tuple[2], 'activity_type': activity_tuple[3]
            })

    return Response(json.dumps(parsed_json), mimetype='application/json')


@app.route('/api/problem_post', methods=['POST'])
def post_problem():
	"""Function which adds data from problem form to DB.
	:return: If request data is invalid:
			 	{'status': False, 'error': [list of errors]}, 400
			 If all ok:
			 	{'added_problem': 'problem_title'
			 	 'problem_id': 'problem_id'}

	"""
	data = request.get_json()

	valid = validator.problem_post(data)

	logger.warning("!!!!!!!!!!!!!!!Problem data")
	logger.warning(data)
	return True

	# if valid['status']:
	# 	if db.post_problem_into_problem_table






 	"""Function which edits resource name.
    	:return: If there is already resource with this name:
                 {'error': 'resource already exists'}, 400
             If request data is invalid:
                 {'status': False, 'error': [list of errors]}, 400
             If all ok:
                 {'added_resource': 'resource_name',
                  'resource_id': 'resource_id'}
    """
    # data = request.get_json()

    # valid = validator.resource_post(data)

    # if valid['status']:
    #     if db.get_resource_id(data['resource_name']):
    #         return jsonify(error='Resource already exists'), 400

    #     db.add_resource(data['resource_name'])
    #     added_res_id = db.get_resource_id(data['resource_name'])
    #     response = jsonify(added_resource=data['resource_name'],
    #                        resource_id=added_res_id[0])
    # else:
    #     response = Response(json.dumps(valid),
    #                         mimetype='application/json'), 400
    # return response