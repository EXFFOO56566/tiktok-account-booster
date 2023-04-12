import { withTranslation, Trans as Trans2 } from 'react-i18next';
import * as React from "react";

const withLang = (Component) => {
  class NewComponent extends React.PureComponent {
    render() {
      const { t } = this.props;

      return <Component trans={t}/>
    }
  }

  return withTranslation()(NewComponent)
};

export const Trans = (props) => (
  <Trans2 i18nKey={props.t}>
    {props.children}
  </Trans2>
);

export default withLang;
