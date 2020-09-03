import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const drawerWidth = 300;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      height: 50
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: drawerWidth,
      [theme.breakpoints.down('xs')]: {
        marginRight: '100%'
      },
    },
    hide: {
      display: 'none',
    }
  }),
);

export default useStyles;