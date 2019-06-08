import React, { Component } from 'react';
import { axiosService } from '../services';
import moment from 'moment';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import MUIDataTable from "mui-datatables";
class DailyProduction extends Component {
	constructor(props, context) {
		super(props, context);

		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleBillingAdjustChange = this.handleBillingAdjustChange.bind(
			this
		);
		this.handleMeterAdjustChange = this.handleMeterAdjustChange.bind(this);
		this.saveChanges = this.saveChanges.bind(this);
		this.onRowClick=this.onRowClick.bind(this)

		this.userId = JSON.parse(localStorage.getItem('currentUser')).id;

		this.state = {
			loading: true,
			dailyProduction: [],
			holder: [],
			show: false,
			prod: {},
			currentPage: 1,
			columns: [
				{
					label: 'ID',
					name: 'id'
				},
				{
					label: 'Kiosk Name',
					name: 'kioskName',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					label: 'Date',
					name: 'date'
				},
				{
					label: 'Daily Prod',
					name: 'dailyProduction',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					label: 'Cumulative Production',
					name: 'cumulativeProduction',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					label: 'Cumul. Meter Adjust.',
					name: 'cumulative_meter_adjustment'
				},
				{
					label: 'Daily Water Meter',
					name: 'dailyWaterMeter',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					label: 'Cumul. Billing Adjust.',
					name: 'cumulative_billing_adjustment'
				},
				{
					label: 'Daily Billable Production',
					name: 'dailyBillableProduction',
					options: {
						filter: true,
						sort: true
					}
				}
			]
		};
	}

	handleClose() {
		this.setState({ show: false });
	}

	handleShow() {
		this.setState({ show: true });
	}

	onRowClick=(row)=>{
		let data={
			id:row[0],
			kioskName:row[1],
			date:row[2],
			dailyProduction:row[3],
			cumulativeProduction:row[4],
			cumulative_meter_adjustment:row[5],
			dailyWaterMeter:row[6],
			cumulative_billing_adjustment:row[7],
			dailyBillableProduction:row[8]
		}
		this.setState({prod:data, show:true})
	}

	async componentDidMount() {
		let data = await axiosService.get('/sema/daily_production');
		this.setState({
			loading: false,
			dailyProduction: data.data,
			holder: data.data,
			data: {
				...this.state.data,
				rows: data.data
			}
		});
	}

	render() {
		const options = {
			selectableRows: false,
			print: false,
			onRowClick: (row,index)=>{
			 this.onRowClick(row)

			}
		  };
		return (
			<div>
				<h1>KIOSKS Daily Production</h1>
				<div>
					<MUIDataTable
						data={this.state.dailyProduction}
						columns={this.state.columns}
						options={options}
					/>
				</div>

				<Modal
					show={this.state.show}
					onHide={this.handleClose}
					dialogClassName="modal-90w"
					aria-labelledby="example-custom-modal-styling-title"
				>
					<Modal.Header closeButton>
						<Modal.Title id="example-custom-modal-styling-title">
							EDIT DAILY PRODUCTION
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form>
							<div className="form-group">
								<label htmlFor="kioskName">Kiosk Name:</label>
								<input
									type="text"
									className="form-control"
									id="kioskName"
									name="kioskName"
									readOnly={true}
									value={this.state.prod.kioskName}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="date">Date:</label>
								<input
									type="text"
									className="form-control"
									id="date"
									name="date"
									readOnly={true}
									value={moment(this.state.prod.date).format(
										'YYYY-MM-DD'
									)}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="dailyProduction">
									Daily Production:
								</label>
								<input
									type="text"
									className="form-control"
									id="dailyProduction"
									name="dailyProduction"
									readOnly={true}
									value={this.state.prod.dailyProduction}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="cumulative_meter_adjustment">
									Cumulative Meter Adjustment:
								</label>
								<input
									type="text"
									className="form-control"
									id="cumulative_meter_adjustment"
									name="cumulative_meter_adjustment"
									value={
										this.state.prod
											.cumulative_meter_adjustment
									}
									onChange={this.handleMeterAdjustChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="dailyWaterMeter">
									Daily Water Meter:
								</label>
								<input
									type="text"
									className="form-control"
									id="dailyWaterMeter"
									name="dailyWaterMeter"
									readOnly={true}
									value={this.state.prod.dailyWaterMeter}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="cumulative_billing_adjustment">
									Cumulative Billing Adjustment:
								</label>
								<input
									type="text"
									className="form-control"
									id="cumulative_billing_adjustment"
									name="cumulative_billing_adjustment"
									value={
										this.state.prod
											.cumulative_billing_adjustment
									}
									onChange={this.handleBillingAdjustChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="dailyBillableProduction">
									Daily Billable Production:
								</label>
								<input
									type="text"
									className="form-control"
									id="dailyBillableProduction"
									name="dailyBillableProduction"
									readOnly={true}
									value={
										this.state.prod.dailyBillableProduction
									}
								/>
							</div>
						</form>
					</Modal.Body>
					<Modal.Footer>
						<Button className="cancel" onClick={this.handleClose}>
							Close
						</Button>
						<Button className="success" onClick={this.saveChanges}>
							Save Changes
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}

	adjustReadings = e => {
		this.setState({ show: true, prod: e });
	};

	handleBillingAdjustChange(event) {
		try {
			let prod = this.state.prod;
			prod.cumulative_billing_adjustment = Number(event.target.value);
			this.setState({ prod: prod });
		} catch (error) {}
	}

	handleMeterAdjustChange(event) {
		try {
			let prod = this.state.prod;
			prod.cumulative_meter_adjustment = Number(event.target.value);
			this.setState({ prod: prod });
		} catch (error) {
			console.log(error);
		}
	}

	saveChanges = () => {
		axiosService
			.put('/sema/daily_production?userId=' + this.userId, {
				id: this.state.prod.id,
				meterAdjustment: this.state.prod.cumulative_meter_adjustment,
				billingAdjustment: this.state.prod
					.cumulative_billing_adjustment,
				kioskId: this.state.prod.kiosk_id
			})
			.then(e => {
				console.log(e)
				this.setState({ show: false, prod: {} });
				this.componentDidMount();
			});
	};
}

export default DailyProduction;
