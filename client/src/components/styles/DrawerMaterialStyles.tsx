import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const drawerWidth = 300;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: '#dbdbdb',
      [theme.breakpoints.down('xs')]: {
        width: '100%'
      },
    },
  }),
);

export default useStyles;