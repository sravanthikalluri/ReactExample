import * as React from "react";
import {
    Button, Checkbox, Col, DropdownButton, FormControl, Modal,
    Row
} from "react-bootstrap";
import Emp from "./Emp.jsx";


class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            getTitle:'Add An Employee',
            userType:'All',
            reverse:false,
            searchDetails:{
              "eName":'',
                "empId":''
            },
            isChecked:false,
            showModal :false,
            result:[],
             searchResults:[],
           addedDetails:{
                "empId":"",
                "eName":"",
                "sal":"",
                "active":""
            },
            isEdit:false,
        };

        this.getEmployeesDetails();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.add = this.add.bind(this);
       this.doSearch = this.doSearch.bind(this);
       this.reset = this.reset.bind(this);
       this.getActiveEmployees = this.getActiveEmployees.bind(this);
    }
    getEmployeesDetails() {
        fetch(`http://localhost:8081/SpringMVCHibernate/persons`)
            .then((data)=> {
                return data.json()
            })
            .then((data) => {
                this.setState({result: data,searchResults:data});
            });
    }
    doSearch(searchText) {
        var sa = new Array();
        this.state.searchDetails[searchText.target.name] = searchText.target.value;
        if(searchText && searchText.target.value) {
            let stringMatch = new RegExp(searchText.target.value, 'i');
            this.state.searchResults.forEach((data) => {
                if (stringMatch.test(data[searchText.target.name])) {
                    sa.push(data);
                }
            });
            this.setState({searchResults:sa});
        }
        else {
           this.setState({searchResults:this.state.result});
        }
    }
    sortBy(field,order) {

        var sortResults = this.state.result;
        if(order) {
            sortResults.sort((a, b) => {
                if ( a[field] < b[field] ){
                    return 1;
                }else if( a[field] > b[field] ){
                    return -1;
                }else{
                    return 0;
                }
            });
        }
        else {
            sortResults.sort((a, b) => {
                if ( a[field] < b[field] ){
                    return -1;
                }else if( a[field] > b[field] ){
                    return 1;
                }else{
                    return 0;
                }
            });
        }
       this.setState({searchResults:sortResults});
    }
    reset() {
        var sd = {
            "eName":'',
            "empId":''
        }
        this.setState({searchDetails:sd});
        this.setState({searchResults:this.state.result});
        this.setState({userType:'All'});
        this.setState({isChecked:false});
    }
    getActiveEmployees(event) {
        this.setState({isChecked:!this.state.isChecked});
        if(!this.state.isChecked) {
            this.state.searchResults = this.state.searchResults.filter((data) => {
               return  data.active == "active";
            });
            this.setState({searchResults:this.state.searchResults});
        }
        else {
            this.setState({searchResults:this.state.result});
        }
    }
    getUserType(event) {
        this.setState({userType:event.target.value});
        if(event.target.value != 'all') {
            this.state.searchResults = this.state.result.filter(data => {
                return data.active == event.target.value;
            });
        }
        else {
            this.state.searchResults = this.state.result;
        }
        this.setState({searchResults:this.state.searchResults});
    }
    onChange(event) {
        this.state.addedDetails[event.target.name] = event.target.value;
        this.setState({addedDetails: this.state.addedDetails});
    }
    open() {
        this.setState({showModal: true});
    }
    close()  {
        this.setState({showModal: false,isEdit:false,addedDetails:{}});
    }
    add() {
        var scope = this;
        if(!this.state.isEdit) {
            fetch('http://localhost:8081/SpringMVCHibernate/person/add', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state.addedDetails)
            })
                .then(function(response) {
                    if(response.status != 200) {
                        console.log("Error");
                    }
                    else {
                        scope.getEmployeesDetails();
                        scope.close();
                    }
                })
                .catch(function(res) {
                    console.log("error" + res);
                }) ;
        }
        else {
            fetch('http://localhost:8081/SpringMVCHibernate/person/update/'+this.state.addedDetails.empId, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state.addedDetails)
            })
                .then(function(response) {
                    if(response.status != 200) {
                        console.log("Error");
                    }
                    else {
                        scope.getEmployeesDetails();
                        scope.close();
                    }
                })
                .catch(function(res) {
                    console.log("error" + res);
                }) ;
        }
        this.setState({addedDetails: {}});
        this.close();
    }
    getEmployeeInfo(data,scope,action) {
        scope.setState({addedDetails:data});
        if(action == "edit") {
            scope.setState({isEdit:true,getTitle:'Edit Existing Employee'});
            scope.open();
        }
       else {
            scope.deleteEmployee(data);
        }

    }
    deleteEmployee(data) {
        var scope = this;
        fetch('http://localhost:8081/SpringMVCHibernate/remove/'+data.empId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(function(response) {
                if(response.status != 200) {
                    console.log("Error");
                }
                else {
                    scope.getEmployeesDetails();
                }
            })
            .catch(function(res) {
                console.log("error" + res);
            }) ;
    }
    handlePageClick(event) {
        alert(event.selected);
    }
    render() {
        var empDetails = this.state.searchResults.map((data,index) => {
            return <Emp key={index} employee={data} empInfo={this.getEmployeeInfo} scope={this}></Emp>
        });

        return (
            <div className="content-area">
                <Row>
                <Col xs={10}>
                <div className="body" >
                   <div className="search-bar">
                       <Row className="show-grid">
                           <Col xs={1}>
                               <Button bsStyle="danger" onClick={this.reset}>reset</Button>
                           </Col>
                           <Col xs={3}>
                               <FormControl type="text"  placeholder="Search All"/>
                           </Col>
                           <Col xs={3}>
                               <FormControl type="text"  placeholder="Search ById" name="empId" value={this.state.searchDetails.empId} onChange={this.doSearch}/>
                           </Col>
                           <Col xs={3}>
                               <FormControl type="text"  placeholder="Search ByName" name="eName" value={this.state.searchDetails.eName} onChange={this.doSearch} />
                           </Col>
                           <Col xs={2}>
                               <Button bsStyle="danger" onClick = {this.open}>Add New User</Button>
                           </Col>
                       </Row>
                       <Row className="show-grid no-margin">
                           <Col xs={2}>
                               <Row>
                                   <label>Search By User Type</label>
                               </Row>
                               <Row>
                                   <select onChange={this.getUserType.bind(this)} value={this.state.userType} name="active">
                                       <option value="all">All</option>
                                       <option value="active">Active</option>
                                       <option value="terminated">Terminated</option>
                                   </select>
                               </Row>
                           </Col>
                           <Col xs={2}>
                               <Row>
                                   <label>Check Active Users</label>
                               </Row>
                               <Row>
                                   <Checkbox bsSize="large" checked={this.state.isChecked} onChange={this.getActiveEmployees}/>
                               </Row>
                           </Col>
                           <Col xs={3}>
                               <Row>
                                   <label>Items per page</label>
                               </Row>
                               <Row>
                                   <DropdownButton bsSize="small" title = "5" id="itemsPerPage">
                                   </DropdownButton>
                               </Row>
                           </Col>
                       </Row>
                       <Row>
                           <table className="table table-bordered">
                               <thead>
                               <tr>
                                   <th className="col-md-4">Employee ID <span className="glyphicon glyphicon-sort-by-order" onClick={this.sortBy.bind(this,'empId',0)} ></span></th>
                                   <th >Employee Name <span className="glyphicon glyphicon-sort-by-alphabet" onClick={this.sortBy.bind(this,'eName',0)}></span> </th>
                                   <th>Salary</th>
                                   <th>User Type</th>
                                   <th></th>
                                   <th></th>
                               </tr>
                               </thead>
                               <tbody >
                               { empDetails }
                               </tbody>
                           </table>
                       </Row>

                   </div>
                    {/*<ReactPaginate previousLabel={"previous"}
                                   nextLabel={"next"}
                                   breakLabel={<a href="">...</a>}
                                   breakClassName={"break-me"}
                                   pageCount={4}
                                   pageRangeDisplayed={2}
                                   onPageChange={this.handlePageClick}
                                   containerClassName={"pagination"}
                                   subContainerClassName={"pages pagination"}
                                   activeClassName={"active"} />*/}
                    <div className="pagination pull-right">
                        <button disabled="true"  className="btn btn-default btn-sm glyphicon glyphicon-triangle-left pull-left"></button>
                        <button  className="btn btn-default btn-sm middlebtn pull-left">{1} of {1}</button>
                        <button  onClick={this.handlePageClick}  className="btn btn-default btn-sm glyphicon glyphicon-triangle-right pull-left"></button>
                   </div>
                </div>
                <Modal show={this.state.showModal} onHide={this.close} keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.getTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="add-employee-modal">
                        <Row>
                            <Col xs={3}>
                                <label>Employee ID</label>
                            </Col>
                            <Col xs={5}>
                                <FormControl type="text" name="empId" value={this.state.addedDetails.empId} onChange={this.onChange.bind(this)} disabled={this.state.isEdit}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3}>
                                <label>Employee Name</label>
                            </Col>
                            <Col xs={5}>
                                <FormControl type="text"  name="eName" value={this.state.addedDetails.eName} onChange={this.onChange.bind(this)} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3}>
                                <label>Salary</label>
                            </Col>
                            <Col xs={5}>
                                <FormControl type="text" name="sal" value={this.state.addedDetails.sal} onChange={this.onChange.bind(this)} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3}>
                                <label>User Type</label>
                            </Col>
                            <Col xs={5}>
                                <select onChange={this.onChange.bind(this)} value={this.state.addedDetails.active} name="active">
                                    <option value="active">Active</option>
                                    <option value="terminated">Terminated</option>
                                </select>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.add}>Save</Button>
                        <Button onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
                </Col>
                </Row>
            </div>
        );
    }
}

export default Home;

/*
 import * as React from "react";
 import ReactHighcharts from "react-highcharts/ReactHighcharts";
 import {Col, Row} from "react-bootstrap";

 class AddModal extends React.Component {
 constructor() {
 super();
 this.state = {
 low_performance_data: [],
 stable_performance_data: [],
 high_performance_data: [],
 high_performance_series:[ {
 data:[]
 }],
 plot:[],
 sectordata: [],
 stockdata: [],
 symbol: '',
 symbolsList: [],
 startdate: [],
 enddate: []
 };
 this.sectorData = this.sectorData.bind(this);
 this.getData = this.getData.bind(this);
 this.getDate = this.getDate.bind(this);
 this.getEndDate = this.getEndDate.bind(this);
 this.stockData = this.stockData.bind(this);
 /!*     fetch(`assets/low_performance.json`)
 .then((data)=> {
 return data.json()
 })
 .then((data) => {
 this.setState({low_performance_data:data});
 });
 fetch(`assets/high_performance.json`)
 .then((data)=> {
 return data.json()
 })
 .then((data) => {
 this.setState({high_performance_data:data});
 });
 *!/
}

componentWillMount() {
    var Papa = require("papaparse/papaparse.min.js");
    Papa.parse('assets/SectorData.csv', {
        header: true,
        download: true,
        skipEmptyLines: true,
        encoding:'',
        complete: this.sectorData
    });
    Papa.parse('assets/YahooFinanceNov2017.csv', {
        header: true,
        download: true,
        skipEmptyLines: true,
        encoding:'',
        complete: this.stockData
    });
}
updateData(result) {
    console.log(result);
}
sectorData(result) {
    this.setState({sectordata:result.data});
}
stockData(result) {
    this.setState({stockdata:result.data});
}
getData(symbols) {
    this.setState({symbol:symbols.target.value});
}
getDate(date) {
    this.setState({startdate:date.target.value});
}
getEndDate(date) {
    this.setState({enddate:date.target.value});
}
render() {

    var uniqueSectors = [];
    var  symbolsList =[];
    var symbols =[];
    this.state.sectordata.map(data => {
        if (uniqueSectors.indexOf(data['Sector']) === -1) {
            uniqueSectors.push(data['Sector']);
            symbolsList[data['Sector']] = [data['Symbol']];
        }
        else{
            symbolsList[data['Sector']].push(data['Symbol']);
        }
    });
    symbols = this.state.stockdata.filter(data =>{
        if(this.state.symbol !== ''){
            var getDates = new Date(data['Date']) < new Date() && new Date(data['Date']) > new Date(this.state.startdate);
            var startDate = (new Date(this.state.startdate).getMonth()+1)+'/'+new Date(this.state.startdate).getDate()+'/'+new Date(this.state.startdate).getFullYear();
            var endDate = (new Date(this.state.enddate).getMonth()+1)+'/'+new Date(this.state.enddate).getDate()+'/'+new Date(this.state.enddate).getFullYear();
            //  var currentDate = new Date(data['Date']).getDate()+'-'+(new Date(data['Date']).getMonth()+1)+'-'+new Date(data['Date']).getFullYear();
            return symbolsList[this.state.symbol].indexOf(data['Symbol']) !== -1 && ((new Date(data['Date']).getTime() === new Date(startDate).getTime()) || (new Date(data['Date']).getTime() === new Date(endDate).getTime()));
        }
        else{
            return [];
        }
    });
    var finalStock = [];
    var grouped = _.groupBy(symbols, symbol => symbol.Symbol);
    /!*  Object.keys(grouped).forEach(data => {
     var totalStockPrice = 0.00;
     grouped[data].map(item => {
     totalStockPrice  += ((item['Close'] - item['Open'])/(item['Open'])) * 100;
     });
     finalStock.push({'symbol':data , price: totalStockPrice/grouped[data].length});
     });*!/
    Object.keys(grouped).forEach(data => {
        var totalStockPrice = 0.00;
        grouped[data].map((item,index) => {
            //totalStockPrice  += ((item['Close'] - item['Open'])/(item['Open'])) * 100;
            if(grouped[data][index+1]) {
                totalStockPrice  = ((grouped[data][index+1].Close - grouped[data][index].Close)/grouped[data][index].Close) * 100;
            }

        });
        finalStock.push({'symbol':data , price: totalStockPrice});
        // finalStock.push({'symbol':data , price: totalStockPrice/grouped[data].length});
    });
    finalStock.sort(function (a, b) {
        return a.price - b.price;
    });

    var low_stocks = finalStock?finalStock.slice(1,11):[];
    var high_Stocks = finalStock?finalStock.slice((finalStock.length - 10)):[];

    high_Stocks.reverse();

    var cate = [];
    var values = [];
    var worstTopArray = [];

    high_Stocks.map(data => {
        worstTopArray.push(data);

    });
    low_stocks.map(data => {
        worstTopArray.push(data);
    });

    worstTopArray.map(data => {
        cate.push(data.symbol);
        values.push(
            {
                name:data.symbol,
                y:Math.round(+data['price'] * 1000) / 1000
            });
    });

    var low_cate = [];
    var low_values = [];
    for(var i=0;i<10;i++){
        low_cate.push('');
        low_values.push(null);
    }
    low_stocks.map(data => {
        /!* seriesOptions_low.push({
         name:data.symbol,
         y:Math.round(+data['price'] * 1000) / 1000
         }
         );*!/
        var color = "red";
        low_cate.push(data.symbol);
        if(+data['price'] > 0) {
            color = "green"
        }
        low_values.push({y:Math.round(+data['price'] * 1000) / 1000,color:color});
    });

    var high_cate = [];
    var high_values = [];

    high_Stocks.map(data => {
        /!*seriesOptions_high.push(
         {
         name:data.symbol,
         y:Math.round(+data['price'] * 1000) / 1000
         }
         );*!/
        var color = "red";
        if(+data['price'] > 0) {
            color = "green"
        }
        high_cate.push(data.symbol);
        high_values.push({y:Math.round(+data['price'] * 1000) / 1000,color:color});
    });
    for(var i=0;i<10;i++){
        high_cate.push('');
        high_values.push(null);
    }
    var config = {
        chart: {
            type: 'bar',
            height: 600 + 'px'
        },
        title:{
            text:''
        },
        legend: {
            layout: 'vertical',
            useHTML: true,
            backgroundColor: '#FFFFFF',
            floating: true,
            align: 'left',
            verticalAlign: 'top',
            x: 90,
            y: 45,
            symbolPadding: 0,
            symbolWidth: 0,
            symbolRadius: 0,
            squareSymbol: false,
            labelFormatter: function () {
                return '<div style="display: inline-flex;line-height:17px"><div class="best-stocks"></div><span style="font-size:16px">Top 10 Best Stocks</span></div> <br/>' +
                    '<div style="display: inline-flex;line-height:17px"><div class="worst-stocks"></div><span style="font-size:16px">Top 10 Worst Stocks</span></div>';
            }
        },
        tooltip: {
            enabled:false
        },
        xAxis: {
            categories:cate,
            visible:true,
            startOnTick: true,
        },
        yAxis: {
            visible:true,
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                },
            },
        },
        series: [{
            data: values,
        }],
        credits: {
            enabled: false
        },
    };
    var config_low = {
        chart: {
            type: 'bar'
        },
        title: {
            text:'Top 10 Low Performance Stock Chart of ' + this.state.symbol + ' for period (' + this.state.startdate + '&' + this.state.enddate + ')',
        },
        xAxis: {
            /!*type:'category',
             title: {
             text:'Symbols'
             }*!/
            categories:low_cate
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            name:'Low Performance Symbols',
            // colorByPoint: true,
            data: low_values
        }],
        credits: {
            enabled: false
        },
    };
    var config_high = {
        chart: {
            type: 'bar'
        },
        title: {
            text:'Top 10 High Performance Stock Chart of ' + this.state.symbol + ' for period (' + this.state.startdate + '&' + this.state.enddate + ')',
        },
        xAxis: {
            /!* type:'category',*!/
            /!*   title: {
             text:'Symbols'
             },
             labels: {
             enabled: true,
             },*!/
            categories:high_cate
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true
                }
            }
        },

        series:[{
            name:'High Performance Symbols',
            //  colorByPoint: true,
            data:high_values
        }],
        credits: {
            enabled: false
        },
    };

    var cc = {
        chart: {
            type: 'bar',
            height: 700
        },
        title: {
            text: null
        },
        exporting: {
            enabled: false
        },
        xAxis: [{
            categories: high_cate,
            labels: {
                enabled: true,
            },
        }, {
            linkedTo: 0,
            opposite: true,
            categories: low_cate,
            labels: {
                enabled: true,
            }
        }],
        yAxis: {
            visible: true,
            title: {
                text: null
            },
            labels: {
                enabled: true
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
        },
        tooltip: {
            enabled:false
        },
        plotOptions: {
            bar: {
                pointWidth: 15,
                grouping: true,
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        return this.y + '%';
                    },
                }
            }
        },
        series: [
            {
                data: high_values,
                name:'Top 10 Best Stocks'
            },
            {
                data: low_values,
                name:'Top 10 Worst Stocks'
            }]

    }
    /!*      console.log(symbolsList);
     this.state.low_performance_data.map(data => {
     seriesOptions_low.push({
     name:data.symbol,
     y:Math.round(+data['(tday - ystdy)'] * 1000) / 1000
     }
     );
     });
     this.state.high_performance_data.map(data => {
     seriesOptions_high.push(
     {
     name:data.symbol,
     y:Math.round(+data['(tday - ystdy)'] * 100) / 100
     }
     );
     categories.push(data.symbol);
     });
     var config_low = {
     chart: {
     type: 'column'
     },
     title: {
     text:'Low Performance Stock Chart ',
     align:'low'
     },
     xAxis: {
     type:'category',
     title: {
     text:'Symbols'
     }
     },
     plotOptions: {
     series: {
     dataLabels: {
     enabled: true
     }
     }
     },
     series: [{
     name:'Low Performance Symbols',
     colorByPoint: true,
     data: seriesOptions_low
     }],
     credits: {
     enabled: false
     },
     };
     var config_high = {
     chart: {
     type: 'column'
     },
     title: {
     text:'High Performance Stock Chart '
     },
     xAxis: {
     type:'category',
     /!*  categories: categories,*!/
     title: {
     text:'Symbols'
     },
     labels: {
     enabled: true,
     }
     },
     plotOptions: {
     series: {
     dataLabels: {
     enabled: true
     }
     }
     },
     tooltip: {
     pointFormat: '{series.data.name}: <b>{point.y}</b><br/>',
     shared: true
     },
     series:[{
     name:'High Performance Symbols',
     colorByPoint: true,
     data:seriesOptions_high
     }],
     credits: {
     enabled: false
     },
     };*!/
    var styles = {
        display:'block'
    };
    return (
        <div className="content-area">
            <Row>
                <div className="header">
                    <div className="header-text">BEST AND WORST DOW STOCKS </div>
                </div>
                <div className="search-tools">
                    <Col xs={4}>
                        <label>Start Date:</label>
                        <input type="date" style={styles} onChange={this.getDate}/>
                    </Col>
                    <Col xs={4}>
                        <label>End Date:</label>
                        <input type="date" style={styles} onChange={this.getEndDate}/>
                    </Col>
                    <Col xs={4}>
                        <label>Sector:</label>
                        <select onChange={this.getData} >
                            <option>-- Select --</option>
                            {
                                uniqueSectors.map(el => <option value={el} key={el} > {el}</option>)
                            }
                        </select>
                    </Col>
                </div>
            </Row>
            { this.state.symbol?
                <Row>
                    {finalStock.length > 0 ?
                        <div>
                            {/!*    <Col xs={6}>
                             <div className="card">
                             <ReactHighcharts  config={config_low} ></ReactHighcharts>
                             </div>
                             </Col>
                             <Col xs={6}>
                             <div className="card">
                             <ReactHighcharts config={config_high}></ReactHighcharts>
                             </div>
                             </Col>*!/}
                            {/!*<Col xs={12}>
                             <div className="card">
                             <ReactHighcharts  config={config} ></ReactHighcharts>
                             </div>
                             </Col>*!/}
                            <Col>
                                <div className="card">
                                    <ReactHighcharts  config={cc} ></ReactHighcharts>
                                </div>
                            </Col>
                        </div> :
                        <img src="assets/images/loading.gif" style={{marginLeft: 45 + '%' ,marginTop: 100 + 'px',}}  />
                    }
                </Row>:  null }
        </div>
    );
}
}
export default AddModal;*/
