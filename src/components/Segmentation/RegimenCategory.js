import React from 'react';
import { TextField, Autocomplete, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DraggableRegimen from './DraggableRegimen'; 

const RegimenCategory = ({
    expand,
    productList,
    firstRegimenList,
    setFirstRegimenList,
    error,
    numberOfCodition,
    databasesMenu,
    conditions,
    handleLogicalOperatorChange,
    handleAutocompleteChange,
    handleAddCondition,
    handleRemoveCondition,
    regimenCategory,
    setRegimenCategory,
    generateQuery,
    importedRegimenList,
    moveRegimenItem,
    handleDeleteRegimanRule,
    handleEdit,
    style
}) => {
    return (
        <>
            {expand.regimenCategory && (
                <div className="segmentation-category-box">
                    <div className="segmentation-category-data">
                        <div className="segmentation-category-data-condition">
                            <h6 className="segmentation-category-data-condition-h6">
                                Market Basket Product
                            </h6>
                            <Autocomplete
                                multiple
                                id="tags-outlined"
                                options={productList}
                                getOptionLabel={(option) => option}
                                value={firstRegimenList}
                                onChange={(event, newValue) => {
                                    setFirstRegimenList(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Select the Product"
                                        size="small"
                                        sx={style.typeFields}
                                    />
                                )}
                            />
                            {error.firstRegimenList && (
                                <h1>{error.firstRegimenList}</h1>
                            )}
                            {Array.from({ length: numberOfCodition }, (_, index) => (
                                <div key={index}>
                                    <div className="regimen-and-condition">
                                        <TextField
                                            id={`products-textfield-${index}`}
                                            sx={style.conditionTextFields}
                                            select
                                            name="dataset"
                                            defaultValue="AND"
                                            size="small"
                                            onChange={(event) =>
                                                handleLogicalOperatorChange(index, event.target.value)
                                            }
                                        >
                                            {databasesMenu.map((option) => (
                                                <MenuItem
                                                    key={option.value}
                                                    value={option.value}
                                                    sx={{ fontSize: '14px', fontWeight: '400' }}
                                                >
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                    <Autocomplete
                                        multiple
                                        id={`products-autocomplete-${index}`}
                                        options={productList}
                                        getOptionLabel={(option) => option}
                                        value={
                                            conditions[index]
                                                ? conditions[index].selectedProducts
                                                : []
                                        }
                                        onChange={(event, newValue) =>
                                            handleAutocompleteChange(index, newValue)
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select the Product"
                                                size="small"
                                                sx={style.typeFields}
                                            />
                                        )}
                                    />
                                    {error?.conditions?.[index] && (
                                        <h1>{error?.conditions[index]}</h1>
                                    )}
                                </div>
                            ))}
                            <div className="segmentation-category-add">
                                <AddIcon
                                    sx={{ color: '#302f2f', cursor: 'pointer' }}
                                    onClick={handleAddCondition}
                                />
                                {numberOfCodition > 0 && (
                                    <RemoveIcon
                                        sx={{ color: '#302f2f', cursor: 'pointer' }}
                                        onClick={handleRemoveCondition}
                                    />
                                )}
                            </div>
                            <h6>Regimen Category</h6>
                            <TextField
                                sx={style.typeFields}
                                id="outlined-textarea"
                                placeholder="Enter a Category Name"
                                name="regimenCategory"
                                size="small"
                                value={regimenCategory}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        generateQuery();
                                    }
                                }}
                                onChange={(event) => {
                                    setRegimenCategory(event.target.value);
                                }}
                            />
                            {error.regimenCategory && <h1>{error.regimenCategory}</h1>}
                        </div>
                        <div className="segmentation-category-addToList">
                            <h5 onClick={generateQuery}>Add &gt;&gt; </h5>
                        </div>

                        <div className="segmentation-regimen-box">
                            {importedRegimenList.length === 0 ? (
                                <h2>Added Regimen Category will be shown Here</h2>
                            ) : (
                                importedRegimenList.flat().map((item, index) => (
                                    <DraggableRegimen
                                        key={index}
                                        item={item}
                                        index={index}
                                        moveItem={moveRegimenItem}
                                        handleDeleteRegimanRule={handleDeleteRegimanRule}
                                        handleEdit={handleEdit}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RegimenCategory;
