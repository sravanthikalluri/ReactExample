
import * as React from "react";

var Emp = React.createClass({

    getEmployeeInfo() {
        this.props.empInfo(this.props.employee,this.props.scope,"edit");
    },
    deleteEmp() {
        this.props.empInfo(this.props.employee,this.props.scope,"delete");
    },
    render:function(){
        var details = this.props.employee;

        return(
            <tr ref='employee'>
                <td>{details.empId}</td>
                <td>{details.eName}</td>
                <td>{details.sal}</td>
                <td>{details.active}</td>
                <td className="edit">
                    <a  onClick={this.getEmployeeInfo}><span className="glyphicon glyphicon-pencil"></span></a>
                </td>
                <td className="delete">
                    <a onClick={this.deleteEmp}> <span className="glyphicon glyphicon-remove-sign"></span></a>
                </td>
            </tr>
        );
    }
});
export default Emp;


