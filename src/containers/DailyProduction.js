import React, { Component } from 'react';
import { axiosService } from '../services';
import moment from 'moment';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import Table from 'react-bootstrap/lib/Table';
import Pagination from 'react-bootstrap/lib/Pagination';
class DailyProduction extends Component {
	constructor(props, context) {
		super(props, context);

		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleBillingAdjustChange = this.handleBillingAdjustChange.bind(
			this
		);
		this.handleMeterAdjustChange = this.handleMeterAdjustChange.bind(this);
		this.filterByKioskName = this.filterByKioskName.bind(this);
		this.saveChanges = this.saveChanges.bind(this);
		this.userId = JSON.parse(localStorage.getItem('currentUser')).id;

		this.state = {
			loading: true,
			dailyProduction: [],
			show: false,
			prod: {},
			currentPage: 1
		};
	}

	handleClose() {
		this.setState({ show: false });
	}

	handleShow() {
		this.setState({ show: true });
	}

	async componentDidMount() {
		let data = await axiosService.get('/sema/daily_production');
		this.setState({ loading: false, dailyProduction: data.data });
	}

	filterByKioskName = e => {
		console.log(e.target.value);
	};

	render() {
		//Pagination
		const perPage = 10;
		const pages = Math.ceil(this.state.dailyProduction.length / perPage);
		const startOffset = (this.state.currentPage - 1) * perPage;
		let startCount = 0;

		return (
			<div>
				<h1>KIOSKS Daily Production</h1>
				<input
					placeholder="Filter By Kiosk Name"
					onChange={e => this.filterByKioskName(e)}
					style={{ width: 500, padding: 10, marginBottom: 20 }}
				/>
				<div>
					<Table hover responsive variant="dark">
						<thead>
							<tr>
								<th>Kiosk Name</th>
								<th>Date </th>
								<th>Daily Production</th>
								<th>Cumulative Production</th>
								<th>Cumulitive Meter Adjustment</th>
								<th>Daily Water Meter</th>
								<th>Cumulative Billing Adjustment</th>
								<th>Daily Billable Production</th>
							</tr>
						</thead>
						<tbody>
							{this.state.dailyProduction.map(e => (
								<tr
									onClick={() => this.adjustReadings(e)}
									data-toggle="tooltip"
									data-placement="top"
									title={
										'Click The row to adjust both  Daily Water Meter and Billable Production of ' +
										e.kioskName +
										' on ' +
										moment(e.date).format('YYYY-MM-DD')
									}
									key={e.id}
								>
									<td>{e.kioskName}</td>
									<td>
										{moment(e.date).format('YYYY-MM-DD')}
									</td>
									<td className="text-center">
										{e.dailyProduction}
									</td>
									<td className="text-center">
										{e.cumulativeProduction}
									</td>
									<td className="text-center">
										{e.cumulative_meter_adjustment}
									</td>
									<td className="text-center">
										{e.dailyWaterMeter}
									</td>
									<td className="text-center">
										{e.cumulative_billing_adjustment}
									</td>
									<td className="text-center">
										{e.dailyBillableProduction}
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Pagination
						className="users-pagination pull-right"
						bsSize="medium"
						maxButtons={20}
						first
						last
						next
						prev
						boundaryLinks
						items={pages}
						activePage={this.state.currentPage}
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
							<div class="form-group">
								<label for="kioskName">Kiosk Name:</label>
								<input
									type="text"
									class="form-control"
									id="kioskName"
									name="kioskName"
									readOnly="true"
									value={this.state.prod.kioskName}
								/>
							</div>
							<div class="form-group">
								<label for="date">Date:</label>
								<input
									type="text"
									class="form-control"
									id="date"
									name="date"
									readOnly="true"
									value={moment(this.state.prod.date).format(
										'YYYY-MM-DD'
									)}
								/>
							</div>
							<div class="form-group">
								<label for="dailyProduction">
									Daily Production:
								</label>
								<input
									type="text"
									class="form-control"
									id="dailyProduction"
									name="dailyProduction"
									readOnly="true"
									value={this.state.prod.dailyProduction}
								/>
							</div>
							<div class="form-group">
								<label for="cumulative_meter_adjustment">
									Cumulative Meter Adjustment:
								</label>
								<input
									type="text"
									class="form-control"
									id="cumulative_meter_adjustment"
									name="cumulative_meter_adjustment"
									value={
										this.state.prod
											.cumulative_meter_adjustment
									}
									onChange={this.handleMeterAdjustChange}
								/>
							</div>
							<div class="form-group">
								<label for="dailyWaterMeter">
									Daily Water Meter:
								</label>
								<input
									type="text"
									class="form-control"
									id="dailyWaterMeter"
									name="dailyWaterMeter"
									readOnly="true"
									value={this.state.prod.dailyWaterMeter}
								/>
							</div>
							<div class="form-group">
								<label for="cumulative_billing_adjustment">
									Cumulative Billing Adjustment:
								</label>
								<input
									type="text"
									class="form-control"
									id="cumulative_billing_adjustment"
									name="cumulative_billing_adjustment"
									value={
										this.state.prod
											.cumulative_billing_adjustment
									}
									onChange={this.handleBillingAdjustChange}
								/>
							</div>
							<div class="form-group">
								<label for="dailyBillableProduction">
									Daily Billable Production:
								</label>
								<input
									type="text"
									class="form-control"
									id="dailyBillableProduction"
									name="dailyBillableProduction"
									readOnly="true"
									value={
										this.state.prod.dailyBillableProduction
									}
								/>
							</div>
						</form>
					</Modal.Body>
					<Modal.Footer>
						<Button class="cancel" onClick={this.handleClose}>
							Close
						</Button>
						<Button class="success" onClick={this.saveChanges}>
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
				this.setState({ show: false, prod: {} });
				this.componentDidMount();
			});
	};
}

export default DailyProduction;
