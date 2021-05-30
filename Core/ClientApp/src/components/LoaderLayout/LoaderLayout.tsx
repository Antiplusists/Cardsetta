import { Component } from 'react';
import { CircularProgress } from "@material-ui/core";

type LoaderLayoutProps = {
    className?: string,
    isLoading: boolean,
    isNotFound: boolean,
    componentNotFound: JSX.Element,
}

export default class LoaderLayout extends Component<LoaderLayoutProps> {
    render() {
        const {  className, isLoading, isNotFound, componentNotFound } = this.props;
        return (<div className={className}>
            {isNotFound && !isLoading
                ? componentNotFound 
                : null
            }
            {isLoading
                ? <CircularProgress className='loader' size={100} />
                : !isNotFound ? this.props.children : null
            }
        </div>);
    }
}