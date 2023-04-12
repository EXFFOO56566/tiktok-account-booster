import * as React from 'react';
import _ from 'lodash'
import {Table as Table2} from 'antd';
import queryString from "query-string";
import {withRouter} from "react-router-dom";
import {GET, POST} from "@app/request";

class UITable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [],
      rows: [],
      pagination: {},
      loading: false,
      page: 1,
      limit: 10,
      sort: '',
      isSort: false,
      search: '',
    };
  }

  componentDidMount() {
    const {
      staticData,
      staticHeader,
      location,
      isAutoFetchData,
      isAddParams,
    } = this.props;

    if (isAutoFetchData) {
      let currentQuery = queryString.parse(location.search);
      const page = this.props.page || (currentQuery?.page || 1);
      const limit = currentQuery?.limit || 10;

      if (!staticData && !staticHeader) {
        this.setState({
          page: parseInt(page, 0),
          limit: parseInt(limit, 0),
          loading: true,
        }, () => {
          this.fetchTableData();
          if (isAddParams) this.pushToParams(page, limit);
        });
      } else {
        this.setState({
          rows: staticData,
          columns: staticHeader,
          page: parseInt(page, 0),
          limit: parseInt(limit, 0),
          pagination: {
            total: staticData.length,
            per_page: 10,
          },
        }, () => isAddParams && this.pushToParams(page, limit));
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      search,
      isReload,
      staticData,
      columns,
      staticHeader
    } = this.props;

    if (search !== prevProps.search && search !== prevState.search) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.changeStateFetchData(search);
    }

    if (isReload && isReload !== prevProps.isReload) {
      this.changeStateFetchData(search);
    }

    if (columns && !_.isEqual(columns, prevProps.columns)) {
      this.changeStateFetchData(search);
    }

    if (staticData !== prevProps.staticData) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        rows: staticData,
        columns: staticHeader,
      });
    }
  }

  changeStateFetchData = (search) => {
    this.setState({
      search,
      page: 1,
      loading: true,
    }, () => this.fetchTableData());
  };

  fetchTableData = () => {
    const {
      limit,
      page,
      sort,
      search,
    } = this.state;

    const {
      service,
      columns,
      payload,
    } = this.props;

    const response = POST(service, {
      ...payload,
    }, {}, true)

    if (response) {
      response.then(({data}) => {
        if (data) {
          this.setState({
            rows: data,
            pagination: {
              total: undefined,
            },
            page: parseInt(page || 1, 0),
            columns,
            loading: false,
          });
        }
      }).catch(() => {
      });
    }
  };

  makeColumns = (columns) => {
    const {
      hiddenCols,
    } = this.props;

    let definedColumns = [];

    if (columns && columns.length > 0) {
      const newColumns = this.hiddenColumn(columns);

      for (let i = 0; i < newColumns.length; i++) {
        if (!hiddenCols[newColumns[i].value]) {
          definedColumns = [
            ...definedColumns,
            {
              title: this.makeColumnName(newColumns[i]),
              dataIndex: newColumns[i].value,
              ...this.handleColumnSort(newColumns[i].value),
              ...this.handlecustomComp(newColumns[i].value),
              width: 300,
              key: newColumns[i].value,
              sort: this.definePositionOfColumn(newColumns[i]?.sort, columns, i),
            },
          ];
        }
      }
    }

    return definedColumns;
  };

  makeColumnName = (column) => {
    const {
      customColsName,
    } = this.props;

    if (!customColsName[column.value]) return column.name;
    if (customColsName[column.value]) return customColsName[column.value];

    return '';
  };

  hiddenColumn = (oldColumns) => {
    const {
      hiddenCols,
    } = this.props;

    let newColumns = [];

    for (let i = 0; i < oldColumns.length; i++) {
      if (hiddenCols.filter((cl) => cl === oldColumns[i].value).length === 0) {
        newColumns = [
          ...newColumns,
          oldColumns[i],
        ];
      }
    }

    return newColumns;
  };

  makecustomCols = (headers) => {
    const {
      defineCols,
      headerWidth
    } = this.props;
    const {
      rows
    } = this.state;

    let definedcustomCols = [];

    for (let i = 0; i < defineCols.length; i++) {
      definedcustomCols = [
        ...definedcustomCols,
        {
          title: !this.isFunction(defineCols[i].name) ? defineCols[i].name : defineCols[i].name(rows),
          dataIndex: defineCols[i].code,
          key: defineCols[i].code,
          ...this.handleColumnSort(defineCols[i].code),
          ...this.handlecustomComp(defineCols[i].code),
          width: headerWidth[defineCols[i]?.code || ''] || 300,
          sort: this.definePositionOfColumn(defineCols[i]?.sort, headers, i),
        },
      ];
    }

    return definedcustomCols;
  };

  definePositionOfColumn = (sort, headers, i) => {
    const {
      defineCols
    } = this.props;

    if (!sort) return defineCols.length + i + 1;

    if (sort === 'end') {
      return headers.length + defineCols.length + 1
    }

    return sort;
  };

  handleColumnSort = (columnName) => {
    const {
      sort,
    } = this.props;

    if (sort[columnName]) {
      return {
        sorter: true,
      };
    }

    return {};
  };

  handlecustomComp = (columnName) => {
    const {
      customComp,
    } = this.props;

    if (customComp[columnName]) {
      return {
        render: (text, row, index) => {
          const dom = customComp[columnName]({text, row, index})

          return dom
        },
      };
    }

    return {};
  };

  pushToParams = (page, limit) => {
    const {
      location,
      history,
    } = this.props;

    const currentQuery = queryString.parse(location.search);

    currentQuery.page = page;
    currentQuery.limit = limit;

    history.push(`${location.pathname}?${queryString.stringify(currentQuery)}`);
  };

  onChangePage = (page) => {
    const {
      staticData,
      isAddParams
    } = this.props;

    this.setState({
      page,
      loading: !staticData,
    }, () => {
      const {
        isSort,
      } = this.state;

      if (!isSort && !staticData) {
        this.fetchTableData();
      }

      if (isAddParams) this.pushToParams(page, this.state.limit);
    });
  };

  onChangePageSize = (limit) => {
    const {
      staticData,
      isAddParams,
    } = this.props;

    this.setState({
      limit,
      page: 1,
      loading: !staticData,
    }, () => {
      if (!staticData) {
        this.fetchTableData();
      }

      if (isAddParams) this.pushToParams(1, limit);
    });
  };

  antIcon = () => <Loading/>;

  onChange = (pg, filters, sorter) => {
    if (sorter && sorter.order && sorter.columnKey) {
      this.setNewSortState(sorter.columnKey, this.sortType(sorter.order), true);
    } else {
      this.setNewSortState('', '', false);
    }
  };

  setNewSortState = (sort, az, status) => {
    this.setState({
      sort: '',
      isSort: status,
    }, () => {
      if (status && !this.props.staticData) {
        this.fetchTableData();
      }
    });
  };

  sortType = (type) => {
    if (type === 'descend') return 'desc';

    if (type === 'ascend') return 'asc';

    return '';
  };

  convertArrayColumnsToAntdColumns = () => {
    const {
      columns
    } = this.state;

    return _.orderBy([...this.makeColumns(columns), ...this.makecustomCols(columns)], ['sort'], ['asc'])
  };

  isFunction = (functionToCheck) => {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
  };

  configSelectAll = () => {
    const {
      onSelectAll
    } = this.props;
    return {
      onChange: (selectedRowKeys, selectedRows) => {
        onSelectAll(selectedRowKeys, selectedRows);
      },
    };
  }

  render() {
    const {
      pagination,
      loading,
      limit,
      page,
      rows,
      total
    } = this.state;

    const {
      className,
      isHiddenPg,
      onSelectAll,
      rowKey
    } = this.props;

    const header = this.convertArrayColumnsToAntdColumns();

    return (
      <div className="w-full">
        <Table2
          {...(onSelectAll ? {
            rowSelection: {
              type: "checkbox",
              ...this.configSelectAll(),
            }
          } : {})}
          rowKey={rowKey || "_id"}
          rowClassName="shdvn-table-row"
          loading={loading}
          pagination={pagination.total ? {
            total: parseInt(pagination.total || 0),
            current: page,
            pageSize: limit,
            onChange: this.onChangePage,
            showSizeChanger: false,
            defaultPageSize: 10,
            pageSizeOptions: ['10', '20', '50', '100', '150'],
            onShowSizeChange: (a, lm) => this.onChangePageSize(lm),
            disabled: isHiddenPg
          } : {}}
          className={`shdvn-table ${className}`}
          dataSource={rows}
          columns={header}
        />
      </div>
    );
  }
}

UITable.defaultProps = {
  sort: {},
  customComp: {},
  hiddenCols: [],
  search: {},
  defineCols: [],
  customColsName: {},
  payload: undefined,
  isReload: '',
  staticData: null,
  staticHeader: null,
  className: '',
  headerWidth: {},
  isScroll: false,
  isHiddenPg: false,
  isAutoFetchData: true,
  isAddParams: true,
  includes: [],
  onSelectAll: undefined,
  rowKey: "_id"
};

export default withRouter(UITable);