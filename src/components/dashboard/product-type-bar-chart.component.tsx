import { groupBy, map, reduce, sumBy } from "lodash";
import { FC, useEffect, useState } from "react";
import { Nav, Navbar, Dropdown } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

import {
  ProductChartGroupTypeEnum,
  ProductBarTypeEnum,
  ProductBarTypeOrthodonticEnum,
} from "../../constants/dashboard";
import {
  IDashboardModel,
  IDashboardOrder,
  IProductGroupUnit,
  IChartSize,
} from "../../redux/domains/Dashboard";
import i18n from "../../i18n";

interface IProductTypeBarChartProps {
  dashboardModel: IDashboardModel;
  chartSize?: IChartSize;
  productChartHeight?: number;
  setProductChartHeight: (height: number) => void;
}

const initChartSize: IChartSize = {
  chartClassName: "",
};
const ProductTypeBarChart: FC<IProductTypeBarChartProps> = ({
  dashboardModel,
  chartSize = initChartSize,
  productChartHeight = 0,
  setProductChartHeight,
}) => {
  const defaultProductType: ProductBarTypeEnum = ProductBarTypeEnum.Overview;

  const [chartGroup, setChartGroup] = useState(
    ProductChartGroupTypeEnum.ByUnit
  );
  const [producTypeBar, setProducTypeBar] =
    useState<ProductBarTypeEnum>(defaultProductType); // NOTE: default start with Overview

  const [groupsByProduct, setGroupsByProduct] = useState<string[]>([]);
  const [selectGroup, setSelectGroup] = useState<string>("");
  // const [innerChartClass, setInnerChartClass] = useState<string>('');

  const [chartDataNumber, setChartDataNumber] = useState<number>(0);

  useEffect(() => {
    setGroupsNameOfProduct(defaultProductType);
  }, []);

  useEffect(() => {
    setChartHeight(chartDataNumber);
  }, [chartDataNumber]);

  const onChangeGroup = (group: ProductChartGroupTypeEnum) => {
    setChartGroup(group);
  };
  const onChangeProductType = (producType: ProductBarTypeEnum) => {
    setProducTypeBar(producType);
    setGroupsNameOfProduct(producType);
  };

  const getProductTypeIdByProductBarTypeEnum = (
    producType: ProductBarTypeEnum
  ) => {
    switch (producType) {
      case ProductBarTypeEnum.CrownAndBridge:
        return 1;
      case ProductBarTypeEnum.Removable:
        return 2;
      case ProductBarTypeEnum.Orthodontic:
        return 3;
      case ProductBarTypeEnum.Orthopedic:
        return 4;
      case ProductBarTypeEnum.ICharm:
        return 5;
      default:
        return 0;
    }
  };

  const getProductBarTypeStringByProductTypeId = (producTypeId: number) => {
    switch (producTypeId) {
      case 1:
        return ProductBarTypeEnum.CrownAndBridge;
      case 2:
        return ProductBarTypeEnum.Removable;
      case 3:
        return ProductBarTypeEnum.Orthodontic;
      case 4:
        return ProductBarTypeEnum.Orthopedic;
      case 5:
        return ProductBarTypeEnum.ICharm;
      default:
        return "";
    }
  };

  const setGroupsNameOfProduct = (producType: ProductBarTypeEnum): void => {
    const groupList = dashboardModel.allGroupsOfProduct.filter(
      (productAndGroup) =>
        productAndGroup.productTypeId ===
        getProductTypeIdByProductBarTypeEnum(producType)
    );
    const groupListStr = groupList.map((group) => group.name);
    setGroupsByProduct(groupListStr);
    setSelectGroup(groupListStr[0] ?? "");
  };

  const productByUnit = (orders: IDashboardOrder[]) => {
    const groupByOrder: IProductGroupUnit[] = [];
    if (orders) {
      orders.forEach((order) => {
        const group = groupBy(order.products, "productName");
        map(group, (product, key) => {
          return {
            productName: key,
            unit: reduce(
              product,
              (total, p) => {
                return total + p.qty;
              },
              0
            ),
          };
        }).forEach((p) => {
          groupByOrder.push({ productName: p.productName, unit: p.unit });
        });
      });

      const result = map(groupBy(groupByOrder, "productName"), (o, idx) => {
        return { productName: idx, unit: sumBy(o, "unit") };
      });
      return result;
    }
    return [];
  };

  const productByCase = (orders: IDashboardOrder[]) => {
    const groupByOrder: { productName: string; unit: number }[] = [];
    if (orders) {
      orders.forEach((order) => {
        const group = groupBy(order.products, "productName");
        map(group, (product, key) => {
          return {
            productName: key,
            unit: 1,
          };
        }).forEach((p) => {
          groupByOrder.push({ productName: p.productName, unit: p.unit });
        });
      });

      const result = map(groupBy(groupByOrder, "productName"), (o, idx) => {
        return { productName: idx, unit: sumBy(o, "unit") };
      });
      return result;
    }
    return [];
  };

  const productTypeByUnit = (orders: IDashboardOrder[]) => {
    const groupByOrder: IProductGroupUnit[] = [];
    orders?.forEach((order) => {
      const group = groupBy(order.products, "productTypeId");
      map(group, (product, key) => {
        return {
          productName: getProductBarTypeStringByProductTypeId(Number(key)),
          unit: reduce(
            product,
            (total, p) => {
              return total + p.qty;
            },
            0
          ),
        };
      }).forEach((p) => {
        groupByOrder.push({ productName: p.productName, unit: p.unit });
      });
    });

    const result = map(groupBy(groupByOrder, "productName"), (o, idx) => {
      return { productName: idx, unit: sumBy(o, "unit") };
    });
    return result;
  };

  const productTypeByCase = (orders: IDashboardOrder[]) => {
    const groupByOrder: { productName: string; unit: number }[] = [];
    orders?.forEach((order) => {
      const group = groupBy(order.products, "productTypeId");
      map(group, (product, key) => {
        return {
          productName: getProductBarTypeStringByProductTypeId(Number(key)),
          unit: 1,
        };
      }).forEach((p) => {
        groupByOrder.push({ productName: p.productName, unit: p.unit });
      });
    });

    const result = map(groupBy(groupByOrder, "productName"), (o, idx) => {
      return { productName: idx, unit: sumBy(o, "unit") };
    });
    return result;
  };

  const filterProductType = (productType: ProductBarTypeEnum) => {
    const orders = dashboardModel?.orderProduct
      ?.map((order) => ({
        ...order,
        products: order.products.filter(
          (product) =>
            product.productTypeId ===
            getProductTypeIdByProductBarTypeEnum(productType)
        ),
      }))
      .filter((order) => order.products.length !== 0);
    return orders;
  };

  const getProductTypeOrthodontic = (unitDate: IDashboardOrder[]) => {
    const data: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
    if (unitDate) {
      unitDate.forEach((product) => {
        switch (product.products[0].productGroupName) {
          case ProductBarTypeOrthodonticEnum.Retainer:
            data[0] += 1;
            break;
          case ProductBarTypeOrthodonticEnum.Passive:
            data[1] += 1;
            break;
          case ProductBarTypeOrthodonticEnum.Functional:
            data[2] += 1;
            break;
          case ProductBarTypeOrthodonticEnum.SpaceMantainer:
            data[3] += 1;
            break;
          case ProductBarTypeOrthodonticEnum.SplintStant:
            data[4] += 1;
            break;
          case ProductBarTypeOrthodonticEnum.Model:
            data[5] += 1;
            break;
          case ProductBarTypeOrthodonticEnum.AntiSnoring:
            data[6] += 1;
            break;
          case ProductBarTypeOrthodonticEnum.Other:
            data[7] += 1;
            break;
        }
      });
    }
    return data;
  };

  const getProductTypeData = (unitDate: IProductGroupUnit[]) => {
    const data: number[] = [0, 0, 0, 0, 0];
    if (unitDate) {
      unitDate.forEach((prduct) => {
        switch (prduct.productName) {
          case ProductBarTypeEnum.CrownAndBridge:
            data[0] = prduct.unit;
            break;
          case ProductBarTypeEnum.Removable:
            data[1] = prduct.unit;
            break;
          case ProductBarTypeEnum.Orthodontic:
            data[2] = prduct.unit;
            break;
          case ProductBarTypeEnum.Orthopedic:
            data[3] = prduct.unit;
            break;
          case ProductBarTypeEnum.ICharm:
            data[4] = prduct.unit;
            break;
        }
      });
    }
    return data;
  };

  const getProductData = (unitDate: IProductGroupUnit[]) => {
    let labels: string[] = [];
    let datas: number[] = [];
    if (unitDate) {
      unitDate.forEach((product) => {
        labels.push(product.productName);
        datas.push(product.unit);
      });
    }
    return { labels, datas };
  };

  const generateData:
    | Chart.ChartData
    | ((canvas: HTMLCanvasElement) => Chart.ChartData) = (
    group: ProductChartGroupTypeEnum,
    producType: ProductBarTypeEnum
  ) => {
    let labels: string[] = [];
    let data: number[] = [];
    let unitData: IProductGroupUnit[] = [];
    const orders: IDashboardOrder[] = filterProductType(producType);

    /* * * * * * * * *
     * FILTER STEPS  *
     * * * * * * * * *
     *
     * 1. filter product by groups of product of each product type (only if filter is not display overall)
     * 2. filter by unit / case (and get label of graph)
     *
     */


    switch (producType) {
      case ProductBarTypeEnum.Overview:
        labels = [
          i18n.t("LABEL_CROWN_AND_BRIDGE"),
          i18n.t("LABEL_REMOVABLE"),
          i18n.t("LABEL_ORTHODONTIC"),
          i18n.t("LABEL_ORTHOPEDIC"),
          i18n.t("LABEL_ICHARM"),
        ];
        if (group === ProductChartGroupTypeEnum.ByCase)
          unitData = productTypeByCase(dashboardModel?.orderProduct);
        else unitData = productTypeByUnit(dashboardModel?.orderProduct);
        data = getProductTypeData(unitData);
        break;

      case ProductBarTypeEnum.Removable:
        let ordersFilteredRemovable: IDashboardOrder[] = [];
        if (orders) {
          ordersFilteredRemovable = orders.map((order) => {
            return {
              ...order,
              products: order.products.filter(
                (product) =>
                  product.productGroupName === selectGroup ||
                  product.productName === selectGroup ||
                  product.productGroupName === "General"
              ),
            };
          });
          if (group === ProductChartGroupTypeEnum.ByCase)
            unitData = productByCase(ordersFilteredRemovable);
          else unitData = productByUnit(ordersFilteredRemovable);

          const productData = getProductData(unitData);
          data = productData.datas;
          labels = productData.labels;
        }
        break;

      default:
        let ordersFiltered: IDashboardOrder[] = [];

        if (orders) {
          ordersFiltered = orders.map((order) => {
            return {
              ...order,
              products: order.products.filter(
                (product) =>
                  product.productGroupName === selectGroup ||
                  product.productName === selectGroup
              ),
            };
          });
        }

        if (group === ProductChartGroupTypeEnum.ByCase)
          unitData = productByCase(ordersFiltered);
        else unitData = productByUnit(ordersFiltered);

        const productData = getProductData(unitData);
        data = productData.datas;
        labels = productData.labels;
        break;
    }
    if (data.length !== chartDataNumber) setChartDataNumber(data.length);
    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: ["#0171BB"],
          borderWidth: 0,
          barPercentage: getbarPercentage(data.length),
        },
      ],
    };
  };

  const setChartHeight = (dataCount: number) => {
    if (dataCount > 39) {
      setProductChartHeight(700);
    } else if (dataCount > 29) {
      setProductChartHeight(600);
    } else if (dataCount > 15) {
      setProductChartHeight(400);
    } else {
      setProductChartHeight(0);
    }
  };
  const getbarPercentage = (dataCount: number) => {
    let result: number = 0.7;
    if (dataCount === 1) {
      result = 0.1;
    } else if (dataCount <= 3) {
      result = 0.4;
    } else result = 0.7;
    return result;
  };

  const generateOption: Chart.ChartOptions = () => {
    const options = {
      indexAxis: "y",
      layout: {
        padding: 20,
      },
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          position: "right",
        },
        title: {
          display: false,
        },
      },
      scales: {
        y: {
          grid: {
            borderColor: "#616161",
            // display:false
            color: "#ffffff",
          },
        },
        x: {
          grid: {
            borderColor: "#ffffff",
          },
          color: "#CACACA",
          ticks: {
            beginAtZero: true,
            callback: (value: any, index: any, values: any) => {
              if (Math.floor(value) === value) {
                return value;
              }
            },
          },
        },
      },
    };
    return options;
  };

  return (
    <div className="cart-product__main-box hexa__box-shadow h-100">
      <Navbar className="cart-product__nav justify-content-between px-0 flex-wrap">
        <div className="cart-product__brand">{i18n.t("ORDERED_PRODUCT")}</div>
        <Nav className="flex-wrap">
          <Dropdown className="dropdown-light">
            <Dropdown.Toggle className="border-radius-4 h-32" variant="">
              <span>{producTypeBar}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-light-menu hexa__box-shadow">
              <Dropdown.Item
                eventKey={ProductBarTypeEnum.Overview}
                className="page-head-dropdown-item"
                onSelect={() =>
                  onChangeProductType(ProductBarTypeEnum.Overview)
                }
              >
                <span>{ProductBarTypeEnum.Overview} </span>
              </Dropdown.Item>
              <Dropdown.Item
                eventKey={ProductBarTypeEnum.CrownAndBridge}
                className="page-head-dropdown-item"
                onSelect={() =>
                  onChangeProductType(ProductBarTypeEnum.CrownAndBridge)
                }
              >
                <span>{ProductBarTypeEnum.CrownAndBridge}</span>
              </Dropdown.Item>
              <Dropdown.Item
                eventKey={ProductBarTypeEnum.Removable}
                className="page-head-dropdown-item"
                onSelect={() =>
                  onChangeProductType(ProductBarTypeEnum.Removable)
                }
              >
                <span>{ProductBarTypeEnum.Removable} </span>
              </Dropdown.Item>
              <Dropdown.Item
                eventKey={ProductBarTypeEnum.Orthodontic}
                className="page-head-dropdown-item"
                onSelect={() =>
                  onChangeProductType(ProductBarTypeEnum.Orthodontic)
                }
              >
                <span>{ProductBarTypeEnum.Orthodontic} </span>
              </Dropdown.Item>
              <Dropdown.Item
                eventKey={ProductBarTypeEnum.Orthopedic}
                className="page-head-dropdown-item"
                onSelect={() =>
                  onChangeProductType(ProductBarTypeEnum.Orthopedic)
                }
              >
                <span>{ProductBarTypeEnum.Orthopedic} </span>
              </Dropdown.Item>
              <Dropdown.Item
                eventKey={ProductBarTypeEnum.ICharm}
                className="page-head-dropdown-item"
                onSelect={() => onChangeProductType(ProductBarTypeEnum.ICharm)}
              >
                <span>{ProductBarTypeEnum.ICharm} </span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {groupsByProduct.length > 0 && (
            <Dropdown className="dropdown-light ml-3">
              <Dropdown.Toggle className="border-radius-4  h-32" variant="">
                <span>{selectGroup}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-light-menu hexa__box-shadow">
                {groupsByProduct.map((groupName: string, index) => {
                  return (
                    <Dropdown.Item
                      key={index}
                      eventKey={groupName}
                      className="page-head-dropdown-item"
                      onSelect={() => {
                        setSelectGroup(groupName);
                      }}
                    >
                      <span>{groupName} </span>
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          )}

          <Dropdown className="dropdown-light ml-3">
            <Dropdown.Toggle className="border-radius-4  h-32" variant="">
              <span>{chartGroup}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-light-menu hexa__box-shadow">
              <Dropdown.Item
                eventKey={ProductChartGroupTypeEnum.ByUnit}
                className="page-head-dropdown-item"
                onSelect={() => onChangeGroup(ProductChartGroupTypeEnum.ByUnit)}
              >
                <span>{ProductChartGroupTypeEnum.ByUnit} </span>
              </Dropdown.Item>
              <Dropdown.Item
                eventKey={ProductChartGroupTypeEnum.ByCase}
                className="page-head-dropdown-item"
                onSelect={() => onChangeGroup(ProductChartGroupTypeEnum.ByCase)}
              >
                <span>{ProductChartGroupTypeEnum.ByCase} </span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>
      <div
        className={chartSize.chartClassName}
        style={{
          height: productChartHeight > 0 ? productChartHeight : undefined,
        }}
      >
        <Bar
          type="horizontalBar"
          data={generateData(chartGroup, producTypeBar)}
          options={generateOption()}
        ></Bar>
      </div>
    </div>
  );
};

export default ProductTypeBarChart;
