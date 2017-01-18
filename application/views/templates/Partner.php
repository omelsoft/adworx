        <div class="row">
            <div class="col-lg-9 margin-tb">
                <div class="pull-left">
                    <h1>Ad Partners</h1>
                </div>
                <div class="pull-right" style="padding-top:30px">
                    <button class="btn btn-success" data-toggle="modal" data-target="#create-user">Create New</button>
                </div>
            </div>
        </div>
        <table class="table table-bordered pagin-table">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Website</th>
                    <th width="220px">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr dir-paginate="value in data | itemsPerPage:5" total-items="totalItems">
                    <td>{{ $index + 1 }}</td>
                    <td>{{ value.name }}</td>
                    <td>{{ value.website }}</td>
                    <td>
                    <button data-toggle="modal" ng-click="edit(value.id)" data-target="#edit-data" class="btn btn-primary">Edit</button>
                    <button ng-click="remove(value,$index)" class="btn btn-danger">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <dir-pagination-controls class="pull-right" on-page-change="pageChanged(newPageNumber)" template-url="application/views/templates/dirPagination.html" ></dir-pagination-controls>
        <!-- Create Modal -->
        <div class="modal fade" id="create-user" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <form method="POST" name="addItem" role="form" ng-submit="saveAdd()">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                        <h4 class="modal-title" id="myModalLabel">Create Item</h4>
                    </div>
                    <div class="modal-body">
                        <div class="">
                            <div class="row">
                                <div class="col-xs-12 col-sm-6 col-md-6">
                                    <strong>Name : </strong>
                                    <div class="form-group">
                                        <input ng-model="form.name" type="text" placeholder="Name" name="title" class="form-control" required />
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6">
                                    <strong>Website : </strong>
                                    <div class="form-group" >
                                        <textarea ng-model="form.website" class="form-control" required>
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="submit" ng-disabled="addItem.$invalid" class="btn btn-primary">Submit</button>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
        <!-- Edit Modal -->
        <div class="modal fade" id="edit-data" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <form method="POST" name="editItem" role="form" ng-submit="saveEdit()">
                        <input ng-model="form.id" type="hidden" placeholder="Name" name="name" class="form-control" />
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                        <h4 class="modal-title" id="myModalLabel">Edit Item</h4>
                    </div>
                    <div class="modal-body">
                        <div class="">
                            <div class="row">
                                <div class="col-xs-12 col-sm-6 col-md-6">
                                    <div class="form-group">
                                       <input ng-model="form.name" type="text" placeholder="Name" name="name" class="form-control" required />
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6">
                                    <div class="form-group">
                                       <textarea ng-model="form.website" class="form-control" required>
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="submit" ng-disabled="editItem.$invalid" class="btn btn-primary create-crud">Submit</button>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
        </div>