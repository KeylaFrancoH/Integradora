const ListItem = ({ label, value }) => {
    return (
      <li>
        <strong>{label}:</strong> {value.toFixed(2)}
      </li>
    );
  };

  
  export default ListItem;