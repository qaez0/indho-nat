import Pagination from '@cherry-soft/react-native-basic-pagination';
import type { PaginationProps } from '@cherry-soft/react-native-basic-pagination/lib/props';

export default function CustomPagination(props: PaginationProps) {
  return (
    <Pagination
    {...props}
    containerStyle={{
      marginTop: 0,
      marginBottom: 0,
    }}
    btnStyle={{
      borderRadius: 5,
      backgroundColor: '#262626',
      borderWidth: 0,
    }}
    textStyle={{
      fontSize: 12,
      fontWeight: 'normal',
      color: '#fff',
    }}
    activeBtnStyle={{
      backgroundColor: '#F3B867',
    }}
    activeTextStyle={{
      color: '#000',
    }}    />
  );
}
