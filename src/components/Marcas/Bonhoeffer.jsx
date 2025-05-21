import React from 'react';
import NavBar from '../Nav/NavBar';
import styles from './Bonhoeffer.module.css';

const Bonhoeffer = () => {
    return (
        <div>
            <NavBar />
            <section className={styles.productosHonda}>
                <div className={styles.productosHeader}>
                    <h2>PRODUCTOS - BONHOEFFER</h2>
                    <span className={styles.iconoFiltro}>⚙</span>
                </div>
                <div className={styles.productosGrid}>
                    {Array(4).fill(0).map((_, index) => (
                        <div className={styles.productoCard} key={index}>
                            <div className={styles.imagenProducto}></div>
                            <div className={styles.detalleProducto}>
                                <p className={styles.descripcion}>
                                    RELOJ TIMEKEY 1115 ORIGINAL – DORADO Y PLATEADO | TIM-1, TIM-2
                                </p>
                                <p className={styles.precio}>S/. 118.99</p>
                                <button className={styles.botonOpcion}>ESCOGER OPCIÓN</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Bonhoeffer;
