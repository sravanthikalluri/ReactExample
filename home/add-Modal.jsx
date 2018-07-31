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

        var low_cate = [];
        var low_values = [];

        for(var i=0;i<10;i++){
            low_cate.push('');
            low_values.push(null);
        }

        low_stocks.map(data => {
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
        var cc = {
            chart: {
                type: 'bar',
                height: 600
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
                enabled: true,
                align:'top'
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
                    name:'Top 10 Best Stocks',
                    color:"green"
                },
                {
                data: low_values,
                name:'Top 10 Worst Stocks',
                    color:"red"
            }]

        }
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
export default AddModal;



