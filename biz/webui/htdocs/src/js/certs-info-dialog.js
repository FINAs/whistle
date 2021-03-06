require('./base-css.js');
require('../css/certs.css');
var React = require('react');
var Dialog = require('./dialog');

var HistoryData = React.createClass({
  getInitialState: function() {
    return { list: [] };
  },
  show: function(data) {
    var list = [];
    Object.keys(data).forEach(function(domain) {
      var cert = data[domain];
      var startDate = new Date(cert.notBefore);
      var endDate = new Date(cert.notAfter);
      var status = 'OK';
      var now = Date.now();
      var isInvalid;
      if (startDate.getTime() > now) {
        isInvalid = true;
        status = 'Invalid';
      } else if (endDate.getTime() < now) {
        isInvalid = true;
        status = 'Expired';
      }
      list.push({
        filename: cert.filename,
        domain: cert.domain,
        validity: startDate.toLocaleString() + ' ~ ' + endDate.toLocaleString(),
        status: status,
        isInvalid: isInvalid
      });
    });
    list.sort(function(a, b) {
      return a.filename > b.filename ? 1 : -1;
    });
    this.refs.certsInfoDialog.show();
    this._hideDialog = false;
    this.setState({ list: list });
  },
  hide: function() {
    this.refs.certsInfoDialog.hide();
    this._hideDialog = true;
  },
  shouldComponentUpdate: function() {
    return this._hideDialog === false;
  },
  render: function() {
    var self = this;
    var list = self.state.list || [];
    return (
      <Dialog ref="certsInfoDialog" wstyle="w-certs-info-dialog">
          <div className="modal-body">
            <button type="button" className="close" onClick={self.hide}>
              <span aria-hidden="true">&times;</span>
            </button>
             <table className="table">
              <thead>
                <th className="w-certs-info-order">#</th>
                <th className="w-certs-info-filename">Filename</th>
                <th className="w-certs-info-domain">Domain</th>
                <th className="w-certs-info-validity">Validity</th>
                <th className="w-certs-info-status">Status</th>
              </thead>
              <tbody>
                {
                  list.length ? list.map(function(item, i) {
                    return (
                      <tr className={item.isInvalid ? 'w-cert-invalid' : undefined}>
                        <th className="w-certs-info-order">{i + 1}</th>
                        <td className="w-certs-info-filename" title={item.filename}>{item.filename}</td>
                        <td className="w-certs-info-domain" title={item.domain}>{item.domain}</td>
                        <td className="w-certs-info-validity" title={item.validity}>{item.validity}</td>
                        <td className="w-certs-info-status">{item.status}</td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="5" className="w-empty">No Data</td>
                    </tr>
                  )
                }
              </tbody>
             </table>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </Dialog>
    );
  }
});

module.exports = HistoryData;
