// BootstrapPagination.react.js
var React = require('react');
var ClassNames = require('classnames');
var BootstrapPagination = React.createClass({
    getInitialState: function() {
        return {
            currentPage: this.props.currentPage,
            shouldCallback: false,
        };
    },
    staticStrings: {
        previousPage: {string: '上一頁', context: 'Title of previous page link.'},
        nextPage: {string: '下一頁', context: 'Title of next page link.'},
        firstPage: {string: '第一頁', context: 'Title of first page link.'},
        lastPage: {string: '最後頁', context: 'Title of last page link.'},
    },
    getPage: function() { return this.state.currentPage; },
    onPageClick: function(e) {
        e.preventDefault(); e.stopPropagation();
        var target = e.target;
        var pager = undefined;
        while(!!target && !pager) {
            if('A' == target.tagName) { pager = target; }
            target = target.parentNode;
        }
        if(!pager) { return; }
        var targetPage = pager.getAttribute('data-page');
        this.setState({currentPage: Number(targetPage), shouldCallback: true});
    },
    componentDidUpdate: function(prevProps, prevState) {
        if(prevProps.currentPage != this.props.currentPage) {
            this.setState({currentPage: this.props.currentPage});
        }
        if(this.state.shouldCallback && !!this.props.onPageChange) {
            this.setState({shouldCallback: false});
            this.props.onPageChange(this.state.currentPage);
        }
    },
    render: function() {
        var state = this.state;
        var pageCount = undefined;
        var currentPage = undefined;
        var pagination = this.props.pagination;
        if(pagination) {
            currentPage = 1 + (pagination.offset/pagination.limit);
            pageCount = Math.ceil(pagination.total/pagination.limit);
        } else {
            pageCount = this.props.pageCount;
            currentPage = this.props.currentPage;
        }
        var strings = this.staticStrings;
        var gridWidth = this.props.gridWidth || '12';
        var pageArray = [];
        var pagingOffset = 5;
        var pagingLength = Math.min(pageCount, 2*pagingOffset + 1);
        var firstPagination = Math.max(0, currentPage - pagingOffset - 1);
        var lastPagination = Math.min(pageCount, currentPage + pagingOffset);
        if(pagingLength > (lastPagination - firstPagination)) {
            if(0 === firstPagination) { lastPagination = pagingLength; }
            else { firstPagination = pageCount - pagingLength; }
        }
        for(var i = firstPagination; i < lastPagination; ++i) { pageArray.push(i + 1); }
        return <div className={'bootstrap-pagination col-md-' + gridWidth}>
            <div className='row'>
                <nav className='col-sm-2'>
                    <ul className="pager">
                        <li className={ClassNames('previous', {'disabled': 1 >= currentPage})}>
                            <a
                                href="#" data-page={currentPage - 1} onClick={this.onPageClick}
                                title={strings.previousPage.string}
                                aria-label={strings.previousPage.string}
                            >
                                <span aria-hidden="true">&larr; </span>
                                {strings.previousPage.string}
                            </a>
                        </li>
                    </ul>
                </nav>
                <nav className='bootstrap-pagination col-sm-8'>
                    <ul className="pagination">
                        <li className={ClassNames({'disabled': 1 >= currentPage})}>
                            <a
                                href="#" data-page={1} onClick={this.onPageClick}
                                title={strings.firstPage.string}
                                aria-label={strings.firstPage.string}
                            >
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        {pageArray.map(function(page, index) {
                            return <li
                                className={ClassNames({'active': currentPage === page})}
                                key={index}
                            >
                                <a
                                    href='#' data-page={page} onClick={this.onPageClick}
                                    aria-label={'頁 ' + page}
                                >
                                    {page}
                                </a>
                            </li>;
                        }, this)}
                        <li className={ClassNames({'disabled':  pageCount <= currentPage})}>
                            <a
                                href="#" data-page={pageCount} onClick={this.onPageClick}
                                title={strings.lastPage.string}
                                aria-label={strings.lastPage.string}
                            >
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                <nav className='col-sm-2'>
                    <ul className="pager">
                        <li className={ClassNames('next', {'disabled': pageCount <= currentPage})}>
                            <a
                                href="#" data-page={currentPage + 1} onClick={this.onPageClick}
                                title={strings.nextPage.string}
                                aria-label={strings.nextPage.string}
                            >
                                {strings.nextPage.string}
                                <span aria-hidden="true"> &rarr;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>;
    }
});
module.exports = BootstrapPagination;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
