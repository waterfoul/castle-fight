import React, { Component } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, ModalTitle } from 'react-bootstrap';

export class CreateRoom extends Component {
	constructor(props) {
		super(props);

		this.state = { showModal: false };

		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.submit = this.submit.bind(this);
	}

	close() {
		this.setState({ showModal: false });
	}

	open() {
		this.setState({ showModal: true });
	}

	submit(event) {
		event.preventDefault();
		const data = {
			name: event.target.elements['lobby-create-room-name'].value,
			password: event.target.elements['lobby-create-room-password'].value
		};
		this.props.createRoom(data);
		this.close();
	}

	render() {
		return (
			<div id="lobby-create-wrapper">
				<Modal show={this.state.showModal} onHide={this.close}>
					<ModalHeader closeButton>
						<ModalTitle>Create a room</ModalTitle>
					</ModalHeader>
					<form onSubmit={this.submit}>
						<ModalBody>
							<div className="form-group">
								<label htmlFor="lobby-create-room-name">Name</label>
								<input
									type="text"
									className="form-control"
									id="lobby-create-room-name"
								/>
							</div>
							<div className="form-group">
								<label htmlFor="lobby-create-room-password">Password</label>
								<input
									type="password"
									className="form-control"
									id="lobby-create-room-password"
								/>
							</div>
						</ModalBody>
						<ModalFooter>
							<input type="submit" className="btn btn-primary" value="Create" />
						</ModalFooter>
					</form>
				</Modal>

				<button className="btn btn-primary" onClick={this.open}>Create Room</button>
			</div>
		);
	}
}
