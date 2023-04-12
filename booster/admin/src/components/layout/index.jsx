import * as React from "react";
import {Helmet} from "react-helmet";
type Props = {
  title?: string;
  description?: string;
  className?: string;
}

const Layout = ({ className, title, description, children }: Props) => {
  return (
    <div className={`w-full ${className}`}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      {children}
    </div>
  )
}

Layout.defaultProps = {
  title: '',
  description: '',
  className: ''
};

export default Layout;